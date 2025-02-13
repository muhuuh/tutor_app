import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, memo } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface CreditWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditWarningModal = memo(function CreditWarningModal({
  isOpen,
  onClose,
}: CreditWarningModalProps) {
  useEffect(() => {
    console.log("Modal state changed:", { isOpen });
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose} static>
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 text-center"
              >
                Insufficient Credits
              </Dialog.Title>

              <div className="mt-4">
                <p className="text-sm text-gray-500 text-center">
                  You've used all your available credits. Please upgrade your
                  plan to continue using this feature.
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <Link
                  to="/pricing"
                  className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  onClick={onClose}
                >
                  Upgrade Plan
                </Link>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});
