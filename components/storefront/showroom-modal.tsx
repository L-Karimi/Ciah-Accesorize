"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function ShowroomModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-12 rounded-full border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
      >
        Visit the showroom
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Private showroom appointments"
        description="Book a guided styling visit for handbags, travel bags, and premium workwear accessories."
        footer={
          <>
            <Button className="rounded-full px-5">Book appointment</Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-5"
              onClick={() => setOpen(false)}
            >
              Maybe later
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Nairobi
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              In-person fittings, work bag curation, and gifting support.
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              WhatsApp
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Share your style brief and receive product recommendations fast.
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Delivery
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Same-week dispatch on selected signature pieces across Kenya.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
