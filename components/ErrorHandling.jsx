'use client'
import React from "react";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { fetchQuotes } from "@/app/store/quoteSlice";

const CustomAlert = React.forwardRef(
  (
    { title, children, variant = "faded", color = "secondary", className, classNames = {}, ...props },
    ref,
  ) => {
    const colorClass = React.useMemo(() => {
      switch (color) {
        case "default":
          return "before:bg-default-300";
        case "primary":
          return "before:bg-primary";
        case "secondary":
          return "before:bg-secondary";
        case "success":
          return "before:bg-success";
        case "warning":
          return "before:bg-warning";
        case "danger":
          return "before:bg-danger";
        default:
          return "before:bg-default-200";
      }
    }, []);

    return (
      <Alert
        ref={ref}
        classNames={{
          ...classNames,
          base: clsx(
            [
              "bg-default-50 dark:bg-background shadow-sm",
              "border-1 border-default-200 dark:border-default-100",
              "relative before:content-[''] before:absolute before:z-10",
              "before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
              "rounded-l-none border-l-0",
              colorClass,
            ],
            classNames.base,
            className,
          ),
          mainWrapper: clsx("pt-1", classNames.mainWrapper),
          iconWrapper: clsx("dark:bg-transparent", classNames.iconWrapper),
        }}
        color={color}
        title={title}
        variant={variant}
        {...props}
      >
        {children}
      </Alert>
    );
  },
);

CustomAlert.displayName = "CustomAlert";

export default function ErrorHandling(props) {
  const colors = ["danger"];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch();
    return (
    <div className="flex flex-col w-full gap-y-6 max-w-md">
      {colors.map((color) => (
        <CustomAlert
          key={color}
          color={color}
          title="Cannot retrive your random quote at the moment.
          Please try again !"
        >
          <div className="flex items-center gap-1 mt-3">
            <Button
              className="bg-background text-default-700 font-medium border-1 shadow-small"
              size="sm"
              variant="bordered"
              onPress={onOpen}            >
              Learn more
            </Button>
          </div>
        </CustomAlert>
      ))}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Why am i getting this message?</ModalHeader>
              <ModalBody>
                <p>
                  {props.error}
                </p>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button> */}
                <Button color="primary" onPress={()=>{
                  dispatch(fetchQuotes())
                  onClose()
                }}>
                  Try Again
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

