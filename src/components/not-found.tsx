import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function NotFound() {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-6">
      <div className="text-center max-w-xl">
        {/* 404 Number */}
        <h1 className="text-[120px] md:text-[160px] font-extrabold text-gray-300 dark:text-gray-700 leading-none select-none">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() =>
              canGoBack ? router.history.back() : router.navigate({ to: "/" })
            }
          >
            Go Back
          </Button>

          <p className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300">
            Contact Support
          </p>
        </div>
      </div>
    </div>
  );
}
