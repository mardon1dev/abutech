import { Modal } from "antd";
import React, { ReactNode } from "react";

interface ModalTypes {
  openModal: boolean;
  title: string;
  mode: "add" | "update";
  children: ReactNode;
  onClose: () => void;
}

const ModalWrapper: React.FC<ModalTypes> = ({
  openModal,
  title,
  children,
  onClose,
}) => {
  return (
    <Modal
      title={title}
      open={openModal}
      onCancel={onClose}
      footer={null}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};

export default ModalWrapper;
