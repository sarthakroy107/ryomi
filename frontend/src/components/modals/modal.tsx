"use client";
import { TModal, useModalStore } from "@/lib/zustand/dialog-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Modal({
  children,
  description,
  title,
  type,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  type: TModal;
}) {
  const { open, type: modalType, setClose } = useModalStore();
  const isOpen = open && type === modalType;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => setClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
