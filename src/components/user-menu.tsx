"use client";

import { useMutation } from "@tanstack/react-query";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { avatarUrl } from "@/lib/avatar";
import { useTRPC } from "@/lib/trpc/client";

type UserMenuProps = {
  account: { id: string; firstName: string; lastName: string; email: string };
};

export function UserMenu({ account }: UserMenuProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const fullName = `${account.firstName} ${account.lastName}`;
  const initials = `${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`;

  const signOut = useMutation(
    trpc["sign-out"].mutationOptions({
      onSuccess: () => router.refresh(),
    }),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Conta de ${fullName}`}
        className="group flex h-10 items-center gap-3 rounded-full text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 md:rounded-xl md:py-1 md:pr-2 md:pl-1 md:hover:bg-muted data-popup-open:md:bg-muted"
      >
        <AccountAvatar id={account.id} initials={initials} />
        <span className="hidden min-w-0 md:grid">
          <span className="max-w-48 truncate text-sm leading-tight font-semibold">
            {fullName}
          </span>
          <span className="max-w-48 truncate text-xs leading-tight text-muted-foreground">
            {account.email}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className="hidden size-4 text-muted-foreground transition-transform group-data-popup-open:rotate-180 md:block"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 text-foreground">
            <AccountAvatar id={account.id} initials={initials} />
            <span className="grid min-w-0">
              <span className="truncate text-sm font-semibold">{fullName}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {account.email}
              </span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
          className="px-2 py-1.5"
        >
          <LogOut aria-hidden />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountAvatar({ id, initials }: { id: string; initials: string }) {
  return (
    <Avatar className="size-9 bg-lavender/30">
      <AvatarImage src={avatarUrl(id)} alt="" width={36} height={36} />
      <AvatarFallback className="bg-lavender/30 text-xs font-semibold text-primary">
        {initials.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
