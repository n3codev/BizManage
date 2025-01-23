import { useState } from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import ModalCreateInvoices from "../ModalCreateInvoices/ModalCreateInvoices";
import ModalEditInvoice from "../ModalEditInvoices/ModalEditInvoices";
import ModalCreateSeller from "../ModalCreateSeller/ModalCreateSeller";
import ModalCreateCustomer from "../ModalCreateCustomer/ModalCreateCustomer";
import ModalEditSellers from "../ModalEditSellers/ModalEditSellers";
import ModalEditCustomer from "../ModalEditCustomers/ModalEditCustomers";

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid #e9e9e9;
  background-color: #ffffff;
  border-radius: 10px;
  align-items: center;
  height: 8rem;
  width: 25rem;
  padding: 0.5rem 0;
`;

const BaseRadiusDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50px;
  width: 6rem;
  height: 6rem;
  margin: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;

  border: 1px solid
    ${({ active, themeColor }) => (active ? themeColor : "#c7c7c7")};
  background-color: ${({ active, themeColor }) =>
    active ? `${themeColor}20` : "#f3f3f3"};

  :active {
    background-color: ${({ themeColor }) =>
      themeColor ? `${themeColor}40` : "#e3e3e3"};
    border-color: ${({ themeColor }) => (themeColor ? themeColor : "#c7c7c7")};
    color: ${({ themeColor }) => (themeColor ? themeColor : "#666666")};
  }

  svg {
    color: inherit;
    height: 3rem;
    width: 3rem;
  }
`;

const RadiusDivCreate = styled(BaseRadiusDiv)`
  background-color: #dcfcdc;
  border-color: #2f8f2f;
`;

const RadiusDivEdit = styled(BaseRadiusDiv)`
  ${({ active }) =>
    active && `background-color: #ffffe0; border-color: #f9c74f;`}
`;

const RadiusDivDelete = styled(BaseRadiusDiv)`
  ${({ active }) =>
    active && `background-color: #f9d8d8; border-color: #f94144;`}
`;

function ToolsForTables({ onDelete, selected = [], onEdit, pageType }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const anySelected = selected.length > 0;

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  const handleEditClick = () => {
    if (anySelected) {
      if (pageType === "sellers") {
        setSelectedSeller(selected[0]);
      } else if (pageType === "invoices") {
        setSelectedInvoice(selected[0]);
      } else if (pageType === "customers") {
        setSelectedCustomer(selected[0]);
      }
      setIsEditModalOpen(true);
      onEdit();
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const renderCreateModal = () => {
    switch (pageType) {
      case "invoices":
        return (
          <ModalCreateInvoices
            isOpen={isCreateModalOpen}
            onConfirm={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
          />
        );
      case "sellers":
        return (
          <ModalCreateSeller
            isOpen={isCreateModalOpen}
            onConfirm={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
          />
        );
      case "customers":
        return (
          <ModalCreateCustomer
            isOpen={isCreateModalOpen}
            onConfirm={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
          />
        );
      default:
        return null;
    }
  };
  const renderEditModal = () => {
    switch (pageType) {
      case "invoices":
        return (
          <ModalEditInvoice
            isOpen={isEditModalOpen}
            onConfirm={handleCloseEditModal}
            onCancel={handleCloseEditModal}
            invoice={selectedInvoice || { id: "", description: "" }}
          />
        );
      case "sellers":
        return (
          <ModalEditSellers
            isOpen={isEditModalOpen}
            onConfirm={handleCloseEditModal}
            onCancel={handleCloseEditModal}
            seller={
              selectedSeller || {
                id: "default-id",
                companyName: "",
                hqAddress: "",
                isActive: false,
              }
            }
          />
        );
      case "customers":
        return (
          <ModalEditCustomer
            isOpen={isEditModalOpen}
            onConfirm={handleCloseEditModal}
            onCancel={handleCloseEditModal}
            customer={selectedCustomer || { id: 0, name: "", email: "" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ButtonsContainer>
        <RadiusDivCreate onClick={handleCreateClick}>
          <FaPlus />
        </RadiusDivCreate>
        <RadiusDivEdit
          active={selected.length === 1 ? "true" : undefined}
          onClick={selected.length === 1 ? handleEditClick : undefined}
        >
          <MdEdit />
        </RadiusDivEdit>

        <RadiusDivDelete
          active={anySelected ? "true" : undefined}
          onClick={onDelete}
        >
          <IoMdClose />
        </RadiusDivDelete>
      </ButtonsContainer>

      {renderCreateModal()}
      {renderEditModal()}
    </>
  );
}

ToolsForTables.propTypes = {
  onDelete: PropTypes.func.isRequired,
  selected: PropTypes.array,
  onEdit: PropTypes.func,
  pageType: PropTypes.oneOf(["invoices", "sellers", "customers"]).isRequired,
};

export default ToolsForTables;
