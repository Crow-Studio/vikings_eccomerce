"use server"
import { db, eq, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { CustomerEditInfo, CustomerFormValues } from "@/types/customers";
import { inArray } from "drizzle-orm";
import { extractPublicId } from "@/lib/server/utils";
const ipBucket = new RefillingTokenBucket<string>(3, 10);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

export async function createNewCustomerAction(
    data: CustomerFormValues
): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) {
        return { errorMessage: "Too many requests!", message: null };
    }
    const clientIP = (await headers()).get("X-Forwarded-For");
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
        return { errorMessage: "Too many requests!", message: null };
    }
    const { user } = await getCurrentSession();
    if (user?.role !== UserRole.ADMIN) {
        return { errorMessage: "Only admins can add customers", message: null };
    }
    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1);
        let avatarUrl: string | null = null;
        if (data.avatar instanceof File) {
            avatarUrl = await uploadFileToCloudinary(data.avatar);
        } else if (typeof data.avatar === "string") {
            avatarUrl = data.avatar;
        }
        await db.insert(tables.customer).values({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            avatar: avatarUrl,
            address: data.address,
            city: data.city,
            country: data.country,
        });
        return { message: "Customer created successfully", errorMessage: null };
    } catch (error) {
        if (error instanceof Error) {
            return { errorMessage: error.message, message: null };
        }
        return { errorMessage: "Failed to create customer", message: null };
    }
}

export async function updateCustomerAction(
    data: CustomerEditInfo
): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) {
        return { errorMessage: "Too many requests!", message: null };
    }
    const clientIP = (await headers()).get("X-Forwarded-For");
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
        return { errorMessage: "Too many requests!", message: null };
    }
    const { user } = await getCurrentSession();
    if (user?.role !== UserRole.ADMIN) {
        return { errorMessage: "Only admins can update customers info", message: null };
    }
    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1);
        let avatarUrl: string | null = null;
        if (data.avatar instanceof File) {
            avatarUrl = await uploadFileToCloudinary(data.avatar);
        } else if (typeof data.avatar === "string") {
            avatarUrl = data.avatar;
        }
        await db.update(tables.customer).set({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            avatar: avatarUrl,
            address: data.address,
            city: data.city,
            country: data.country,
        }).where(eq(tables.customer.id, data.id));
        return { message: "Customer updated successfully", errorMessage: null };
    } catch (error) {
        if (error instanceof Error) {
            return { errorMessage: error.message, message: null };
        }
        return { errorMessage: "Failed to update customer", message: null };
    }
}

export async function deleteCustomersAction(
  customers: CustomerEditInfo[]
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return { errorMessage: "Too many requests!", message: null }
  }

  const clientIP = (await headers()).get("X-Forwarded-For")

  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return { errorMessage: "Too many requests!", message: null }
  }

  const { user } = await getCurrentSession()
  if (user?.role !== UserRole.ADMIN) {
    return { errorMessage: "Only admins can delete customers info", message: null }
  }

  try {
    if (clientIP !== null) ipBucket.consume(clientIP, 1)

    for (const customer of customers) {
      if (customer.avatar && typeof customer.avatar === "string") {
        const publicId = extractPublicId(customer.avatar)
        if (publicId) {
          await cloudinary.uploader.destroy(publicId)
        }
      }
    }

    const ids = customers.map((c) => c.id)

    await db.delete(tables.customer).where(inArray(tables.customer.id, ids))

    return { message: "Customers deleted successfully", errorMessage: null }
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message, message: null }
    }
    return { errorMessage: "Failed to delete customers", message: null }
  }
}

async function uploadFileToCloudinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error || !result) {
                    return reject(new Error(error?.message || "Avatar upload failed"));
                }
                resolve(result.secure_url);
            }
        );
        file
            .arrayBuffer()
            .then((buf: ArrayBuffer) => {
                stream.end(Buffer.from(buf));
            })
            .catch(reject);
    });
}
