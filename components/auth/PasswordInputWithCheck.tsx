import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends InputProps {
  ref?: React.Ref<HTMLInputElement>;
  showValidation?: boolean;
}

const PasswordInputWithChecks: React.FC<PasswordInputProps> = ({
  className,
  ref,
  showValidation = true,
  ...props
}) => {
  const id = React.useId();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const password = (props.value as string) || "";

  const checkStrength = (pass: string) => {
    const requirements = [
      {
        regex: /.{8,}/,
        text: "At least 8 characters",
        zodCheck: pass.length >= 8 && pass.length <= 128,
      },
      {
        regex: /[0-9]/,
        text: "At least 1 number",
      },
      {
        regex: /[a-z]/,
        text: "At least 1 lowercase letter",
      },
      {
        regex: /[A-Z]/,
        text: "At least 1 uppercase letter",
      },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: 'At least 1 special character (!@#$%^&*(),.?":{}|<>)',
      },
    ];

    // Check for weak patterns
    const weakPatterns = [
      /^(.)\1+$/, // All same character
      /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
      /^(password|123456|qwerty|admin|letmein)/i, // Common passwords
    ];

    const hasWeakPattern = weakPatterns.some((pattern) => pattern.test(pass));
    const hasWhitespace = pass !== pass.trim();

    const basicRequirements = requirements.map((req) => ({
      met: req.zodCheck !== undefined ? req.zodCheck : req.regex.test(pass),
      text: req.text,
    }));

    // Add additional validation checks
    const additionalChecks = [
      {
        met: !hasWeakPattern,
        text: "No common patterns or sequences",
      },
      {
        met: !hasWhitespace,
        text: "No leading or trailing spaces",
      },
    ];

    return [...basicRequirements, ...additionalChecks];
  };

  const strength = checkStrength(password);

  const strengthScore = React.useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 2) return "bg-red-500";
    if (score <= 4) return "bg-orange-500";
    if (score === 5) return "bg-amber-500";
    if (score === 6) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Very weak password";
    if (score <= 4) return "Weak password";
    if (score === 5) return "Medium password";
    if (score === 6) return "Good password";
    return "Strong password";
  };

  const maxScore = strength.length;

  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
          placeholder={props.placeholder || "Enter your password"}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-describedby={showValidation && isFocused ? `${id}-description` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={password === "" || props.disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      {showValidation && isFocused && (
        <>
          <div
            className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={maxScore}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / maxScore) * 100}%` }}
            ></div>
          </div>

          <p
            id={`${id}-description`}
            className="text-foreground mb-2 text-sm font-medium"
          >
            {getStrengthText(strengthScore)}. Requirements:
          </p>

          <ul className="space-y-1.5" aria-label="Password requirements">
            {strength.map((req) => (
              <li key={req.text} className="flex items-center gap-2">
                {req.met ? (
                  <Check size={16} className="text-emerald-500" aria-hidden="true" />
                ) : (
                  <X size={16} className="text-muted-foreground/80" aria-hidden="true" />
                )}
                <span
                  className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Requirement met" : " - Requirement not met"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

PasswordInputWithChecks.displayName = "PasswordInputWithChecks";

export { PasswordInputWithChecks };