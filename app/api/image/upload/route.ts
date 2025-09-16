import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/session";
import { cloudinary } from "@/lib/server/cloudinary";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function POST(request: NextRequest) {
  try {
    const { image } = (await request.json()) as { image: string };
    const { user } = await getCurrentSession();

    if (!(await globalPOSTRateLimit())) {
      return NextResponse.json(null, {
        status: 429,
        statusText: "Too many requests. Please wait a moment and try again.",
      });
    }

    const clientIP = (await headers()).get("X-Forwarded-For");
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
      return NextResponse.json(null, {
        status: 429,
        statusText:
          "Too many requests from your location. Please wait a few minutes before trying again.",
      });
    }

    if (!user) {
      return NextResponse.json(null, { status: 401, statusText: "Unauthorized!" });
    }

    if (typeof image !== "string" || !image) {
      return NextResponse.json(null, { status: 400, statusText: "Image is required!" });
    }

    const result = await cloudinary.uploader.upload(image, {
      resource_type: "image",
    });

    if (!result) {
      return NextResponse.json(null, { status: 400, statusText: "Failed to upload image!" });
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("POST /upload error:", error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message || "unknown error"}` },
      { status: 400 }
    );
  }
}
