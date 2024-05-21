"use client";

import React, { Fragment, useState } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import { addUserEmailToProduct } from "@/lib/actions";

const Modal = ({ productId }: { productId: string }) => {
  let [isOpen, setIsOpen] = useState(false);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [email, setEmail] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setIsSubmitting(true);
    await addUserEmailToProduct(productId, email);
    setIsSubmitting(false);
    setEmail("");
    setIsOpen(false);
  }
  return (
    <>
      <button
        className="btn"
        onClick={() => setIsOpen(true)}
      >
        Track
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="dialog-container relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="dialog-content">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-300 rounded-10">
                      <Image
                        alt="price wise"
                        width={28}
                        height={28}
                        src="/assets/icons/logo.svg"
                      />
                    </div>
                    <Image
                      alt="close"
                      width={24}
                      height={24}
                      src="/assets/icons/x-close.svg"
                      className="cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    />
                  </div>
                  <h4 className="dialog-head_text">
                    Stay updated with product pricing alerts
                    right in your inbox!
                  </h4>
                  <p className="text-sm mt-2 text-gray-600">
                    Never miss a bargain again with our
                    timely alerts!{" "}
                  </p>
                </div>
                <form
                  className="flex flex-col mt-5"
                  onSubmit={handleSubmit}
                >
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="dialog-input_container">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />

                    <input
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      className="dialog-input"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="dialog-btn"
                  >
                    {isSubmitting ? "Tracking..." : "Track"}
                  </button>
                </form>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
