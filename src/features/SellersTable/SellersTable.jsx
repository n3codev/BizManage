import {
  getSellers,
  deleteSeller,
  createSeller,
  editSellers,
} from "../../services/apiSellers";
import "./SellersTable.css";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner/Spinner";
import SellersRow from "../SellersRow/SellersRow";
import ToolsForTables from "../../ui/ToolsForTables/ToolsForTables";
import React from "react";
import ModalDelete from "../../ui/ModalDelete/ModalDelete";
import ModalCreateSeller from "../../ui/ModalCreateSeller/ModalCreateSeller";
import { toast } from "react-toastify";
import ModalEditSeller from "../../ui/ModalEditSellers/ModalEditSellers";
import Pagination from "../../ui/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import { getInvoice } from "../../services/apiInvoices";

function SellersTable({ searchQuery = "", multipleSelect = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 4;

  const {
    data: { data: sellers = [], count = 0 } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sellers", currentPage, pageSize],
    queryFn: () => getSellers(currentPage, pageSize),
    keepPreviousData: true,
  });

  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [currentSeller, setCurrentSeller] = React.useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      const { data: allSellers } = await getSellers();

      const sellersToDelete = allSellers.filter((seller) =>
        ids.includes(seller.id)
      );

      const checkInvoicesForSellers = async (sellers) => {
        const results = await Promise.all(
          sellers.map(async (seller) => {
            const { data: invoices } = await getInvoice();
            const hasInvoices = invoices.some(
              (invoice) => invoice.sellerName === seller.companyName
            );
            return {
              id: seller.id,
              companyName: seller.companyName,
              hasInvoices,
            };
          })
        );
        return results;
      };

      const invoiceChecks = await checkInvoicesForSellers(sellersToDelete);
      const sellersWithInvoices = invoiceChecks.filter(
        (check) => check.hasInvoices
      );

      if (sellersWithInvoices.length > 0) {
        const namesWithInvoices = sellersWithInvoices.map(
          (check) => check.companyName
        );
        throw new Error(
          `Cannot delete sellers with existing invoices: ${namesWithInvoices.join(
            ", "
          )}`
        );
      }

      await Promise.all(ids.map((id) => deleteSeller(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sellers"]);
      setSelectedIds([]);
      toast.success("Seller(s) successfully deleted");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const createMutation = useMutation({
    mutationFn: async (newSeller) => {
      const createdSeller = await createSeller(newSeller);
      return createdSeller;
    },
    onSuccess: (createdSeller) => {
      queryClient.setQueryData(["sellers"], (oldData) => {
        return oldData ? [...oldData, createdSeller] : [createdSeller];
      });
      setIsCreateModalOpen(false);
      toast.success("Seller successfully created");
    },
    onError: (error) => {
      toast.error(`Error creating Seller: ${error.message}`);
    },
  });

  const editMutation = useMutation({
    mutationFn: editSellers,
    onSuccess: () => {
      queryClient.invalidateQueries(["sellers"]);
      setIsEditModalOpen(false);
      toast.success("Seller successfully edited");
    },
    onError: (error) => {
      console.log("Error editing seller:", error);
      toast.error(`Error: ${error.message}`);
    },
  });

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

  const handleOpenEditModal = () => {
    if (selectedIds.length === 1) {
      const selectedSeller = sellers.find(
        (seller) => seller.id === selectedIds[0]
      );
      setCurrentSeller(selectedSeller);
      setIsEditModalOpen(true);
    } else {
      toast.error("Please select a single seller to edit.");
    }
  };

  const handleConfirmEdit = (updates) => {
    if (currentSeller) {
      const { id } = currentSeller;
      editMutation.mutate({ id, ...updates });
      setCurrentSeller(null);
    } else {
      toast.error("No seller selected for editing.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setCurrentSeller(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = (newSeller) => {
    createMutation.mutate(newSeller);
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  const filteredSellers = React.useMemo(
    () =>
      sellers.filter((seller) =>
        seller.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [sellers, searchQuery]
  );

  // Calculate total pages
  const totalPages = Math.ceil(count / pageSize);

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error loading sellers. Please try again later.</div>;

  return (
    <>
      <div className="table" role="table" aria-label="Sellers Table">
        <header className="table-header" role="rowgroup">
          <div role="columnheader">Company Name</div>
          <div role="columnheader" style={{ textAlign: "center" }}>
            HQ Address
          </div>
          <div role="columnheader" style={{ textAlign: "center" }}>
            Is Active
          </div>
        </header>
        {filteredSellers.map((seller) => (
          <SellersRow
            key={seller.id}
            seller={seller}
            isSelected={selectedIds.includes(seller.id)}
            onClick={() => handleRowClick(seller.id)}
          />
        ))}
        {count > pageSize && (
          <footer className="footer">
            <Pagination
              count={count}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalPages={totalPages}
            />
          </footer>
        )}
      </div>
      <ToolsForTables
        onDelete={handleDelete}
        onCreate={handleOpenCreateModal}
        selected={selectedIds}
        onEdit={handleOpenEditModal}
        pageType="sellers"
      />
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ModalCreateSeller
        isOpen={isCreateModalOpen}
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelCreate}
      />
      <ModalEditSeller
        isOpen={isEditModalOpen}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        seller={currentSeller}
      />
    </>
  );
}

SellersTable.propTypes = {
  searchQuery: PropTypes.string,
  multipleSelect: PropTypes.bool,
};

export default SellersTable;
