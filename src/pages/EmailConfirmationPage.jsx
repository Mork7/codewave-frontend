import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getMessage = () => {
    switch (status) {
      case "success":
        return "✅ Your email has been successfully verified!";
      case "expired":
        return "⏳ This verification link has expired. Request a new one below.";
      case "invalid":
        return "❌ Invalid verification link. Please check your email and try again.";
      case "notfound":
        return "⚠️ User not found. Please register again.";
      case "already_verified":
        return "ℹ️ Your email has already been verified.";
      default:
        return "⚙️ Verifying your email...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Email Verification
      </h1>
      <p className="text-lg text-gray-600 mb-4">{getMessage()}</p>
      <p className="text-sm text-gray-500">
        Redirecting you to the home page in a few seconds...
      </p>
    </div>
  );
}
