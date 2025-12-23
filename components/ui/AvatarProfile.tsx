"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import clsx from "clsx";
import { signOut } from "next-auth/react";

export default function AvatarProfile({
  name,
  image,
}: {
  name?: string | undefined | null;
  image?: string | undefined | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={clsx("rounded-full cursor-pointer")}
      >
        <Avatar className="max-md:w-8 max-md:h-8">
          <AvatarFallback>
            {name?.split("").slice(0, 2).join("").toUpperCase().toString()}
          </AvatarFallback>
          <AvatarImage src={image ?? ""} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 max-md:text-xs max-md:w-28 text-center">
        <DropdownMenuItem>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              await signOut();
            }}
            variant={"link"}
          >
            Deconnexion
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
