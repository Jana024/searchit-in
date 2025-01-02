import { Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="flex items-center justify-center p-4 sm:p-8">
    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
  </div>
);