"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { FormInput } from "@/components/form/FormInput";
import { ROUTES } from "@/config/routes";
import { loginSchema, type LoginValues } from "../schemas";

const { Title, Text } = Typography;

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "totp">("credentials");
  const [otp, setOtp] = useState("");

  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // UI-only: credentials step advances to 2FA (TOTP required for DOCTOR/SUPER_ADMIN).
  const onSubmit = handleSubmit(() => setStep("totp"));

  const verify = () => router.push(ROUTES.patients);

  return (
    <Flex vertical gap={4} style={{ marginBottom: 8 }}>
      <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: "#1677FF" }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Yangon EMR
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Electronic Medical Records
          </Text>
        </div>
      </Flex>

      {step === "credentials" ? (
        <Form layout="vertical" onSubmitCapture={onSubmit}>
          <FormInput
            control={control}
            name="username"
            label="Username"
            placeholder="Enter username"
            prefix={<UserOutlined />}
          />
          <FormInput
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            prefix={<LockOutlined />}
          />
          <Button type="primary" htmlType="submit" block size="middle">
            Sign in
          </Button>
        </Form>
      ) : (
        <Flex vertical gap={16}>
          <div>
            <Text strong>Two-factor authentication</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Enter the 6-digit code from your authenticator app.
            </Text>
          </div>
          <Input.OTP length={6} value={otp} onChange={setOtp} />
          <Button type="primary" block size="middle" onClick={verify}>
            Verify &amp; continue
          </Button>
          <Button type="link" size="small" onClick={() => setStep("credentials")}>
            Back
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
