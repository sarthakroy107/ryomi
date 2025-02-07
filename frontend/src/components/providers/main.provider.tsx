import { Toaster } from "sonner";
import { ModalProvider } from "./modal-provider";
import { QueryProvider } from "./react-query.provider";
import { ThemeProvider } from "./theme.provider";

export default function AllProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        disableTransitionOnChange={true}
      >
        <ModalProvider />
        <Toaster />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
