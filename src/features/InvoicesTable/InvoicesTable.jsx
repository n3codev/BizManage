import "./InvoicesTable.css";
import { useState, useMemo } from "react";
import {
  getInvoice,
  deleteInvoices,
  createInvoices,
  editInvoices,
} from "../../services/apiInvoices";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner/Spinner";
import InvoicesRow from "../../features/InvoicesRow/InvoicesRow";
import ToolsForTables from "../../ui/ToolsForTables/ToolsForTables";
import ModalDelete from "../../ui/ModalDelete/ModalDelete";
import ModalCreateInvoices from "../../ui/ModalCreateInvoices/ModalCreateInvoices";
import ModalEditInvoice from "../../ui/ModalEditInvoices/ModalEditInvoices";
import { toast } from "react-toastify";
import Pagination from "../../ui/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";

function InvoicesTable({ searchQuery = "", multipleSelect = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 4;
  const {
    isLoading,
    isError,
    data: { data: invoices = [], count = 0 } = {},
  } = useQuery({
    queryKey: ["invoices", currentPage],
    queryFn: () => getInvoice(currentPage),
    keepPreviousData: true,
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const queryClient = useQueryClient();

  /* DELETE MUTATION FUNCTION INVOICES */
  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => deleteInvoices(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      setSelectedIds([]);
      toast.success("Invoice(s) deleted successfully!");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  /* CREATE MUTATION FUNCTION INVOICES */

  const createMutation = useMutation({
    mutationFn: async (newInvoice) => {
      await createInvoices(newInvoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      setIsCreateModalOpen(false);
      toast.success("Invoice successfully created");
    },
    onError: (error) => {
      toast.error(`Error creating Invoice: ${error.message}`);
    },
  });

  /* EDIT MUTATION FUNCTION INVOICES */

  const editMutation = useMutation({
    mutationFn: async (updatedInvoice) => {
      if (updatedInvoice.id && Object.keys(updatedInvoice).length > 1) {
        await editInvoices(updatedInvoice);
      } else {
        throw new Error("ID and updates are required");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      setIsEditModalOpen(false);
      toast.success("Invoice successfully edited");
    },
    onError: (error) => {
      toast.error(`Error editing invoice: ${error.message}`);
    },
  });

  /* HANDLE DELETE */
  const handleDelete = () => {
    if (selectedIds.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(selectedIds);
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleRowClick = (id) => {
    setSelectedIds((prevSelectedIds) => {
      const isSelected = prevSelectedIds.includes(id);
      return multipleSelect
        ? isSelected
          ? prevSelectedIds.filter((selectedId) => selectedId !== id)
          : [...prevSelectedIds, id]
        : isSelected
        ? []
        : [id];
    });
  };

  /* HANDLE EDIT */
  const handleOpenEditModal = () => {
    if (selectedIds.length === 1) {
      const selectedInvoice = invoices.find(
        (invoice) => invoice.id === selectedIds[0]
      );
      setCurrentInvoice(selectedInvoice);
      setIsEditModalOpen(true);
    } else {
      toast.error("Please select a single invoice to edit.");
    }
  };

  const handleConfirmEdit = (updates) => {
    if (currentInvoice) {
      const { id } = currentInvoice;
      editMutation.mutate({ id, ...updates });
      setCurrentInvoice(null);
    } else {
      toast.error("No invoice selected for editing.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setCurrentInvoice(null);
  };

  /* HANDLE CREATE */
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = (newInvoice) => {
    createMutation.mutate(newInvoice);
    setIsCreateModalOpen(false);
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
  };

  /* HANDLE PAGE CHANGE */
  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const sellerName = invoice.seller?.name || "";
        return sellerName
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase());
      }),
    [invoices, searchQuery]
  );

  const totalPages = Math.ceil(count / pageSize);

  if (isLoading) return <Spinner />;
  if (isError)
    return <div>Error loading invoices. Please try again later.</div>;

  return (
    <>
      <div className="table" role="table">
        <div className="table-header-invoices" role="rowgroup">
          <div role="columnheader">Seller Name</div>
          <div role="columnheader" style={{ textAlign: "center" }}>
            Customer Name
          </div>
          <div role="columnheader" style={{ textAlign: "center" }}>
            Date
          </div>
          <div role="columnheader" style={{ textAlign: "center" }}>
            Amount
          </div>
        </div>
        {filteredInvoices.map((invoice) => (
          <InvoicesRow
            key={invoice.id}
            invoice={invoice}
            isSelected={selectedIds.includes(invoice.id)}
            onClick={() => handleRowClick(invoice.id)}
          />
        ))}
        {count > pageSize && (
          <div className="table-footer">
            <Pagination
              count={count}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
      <ToolsForTables
        selected={selectedIds}
        onDelete={handleDelete}
        onCreate={handleOpenCreateModal}
        onEdit={handleOpenEditModal}
        pageType="invoices"
      />
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ModalCreateInvoices
        isOpen={isCreateModalOpen}
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelCreate}
      />
      <ModalEditInvoice
        isOpen={isEditModalOpen}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        invoice={currentInvoice}
      />
    </>
  );
}

InvoicesTable.propTypes = {
  searchQuery: PropTypes.string,
  multipleSelect: PropTypes.bool,
};

export default InvoicesTable;
