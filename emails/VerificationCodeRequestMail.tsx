import * as React from "react";
import {
  Container,
  Font,
  Head,
  Html,
  Img,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationCodeRequestMailProps {
  code: string;
}

export const VerificationCodeRequestMail: React.FC<
  Readonly<VerificationCodeRequestMailProps>
> = ({ code }) => {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
              fontFamily: {
                roboto: ["Roboto", "Verdana", "sans-serif"],
              },
            },
          },
        }}
      >
        <Container className="mx-auto max-w-[600px] px-4 py-8 font-roboto">
          <Img
            src="https://res.cloudinary.com/dfa1yoc1v/image/upload/v1732631847/wmmww1qiii7eiprbwphj.png"
            alt="useOdama"
            width="200"
            height="60"
            className="rounded-md mx-auto object-contain"
          />
          <Text className="text-xl text-center font-semibold">
            The code below is only valid for 10 minutes.
          </Text>
          <Text className="block rounded-md bg-gray-100 p-5 text-center text-3xl text-brand font-mono">
            {code}
          </Text>
        </Container>
      </Tailwind>
    </Html>
  );
};
