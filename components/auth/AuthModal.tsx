import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Commencer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background font-semibold">
              Re
            </div>
          </div>
          <DialogTitle className="text-xl">Bienvenue sur Revise</DialogTitle>
          <DialogDescription>
            Connectez-vous pour commencer à réviser avec l&apos;IA
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full">
              Se connecter
            </Button>
          </Link>
          <Link href="/auth/signup" className="w-full">
            <Button variant="outline" className="w-full">
              Créer un compte
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
