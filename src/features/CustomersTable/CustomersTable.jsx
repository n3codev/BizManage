import {
  getCustomers,
  deleteCustomer,
  createCustomer,
  editCustomer,
} from "../../services/apiCustomers";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner/Spinner";
import CustomersRow from "../CustomersRow/CustomersRow";
import React from "react";
import ToolsForTables from "../../ui/ToolsForTables/ToolsForTables";
import ModalDelete from "../../ui/ModalDelete/ModalDelete";
import ModalCreateCustomer from "../../ui/ModalCreateCustomer/ModalCreateCustomer";
import ModalEditCustomer from "../../ui/ModalEditCustomers/ModalEditCustomers";
import { toast } from "react-toastify";
import Pagination from "../../ui/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import { getInvoice } from "../../services/apiInvoices";
import "./CustomersTable.css";

function CustomersTable({ searchQuery = "", multipleSelect = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 4;

  const {
    data: { data: customers = [], count = 0 } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers", currentPage, pageSize],
    queryFn: () => getCustomers(currentPage, pageSize),
    keepPreviousData: true,
  });

  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [currentCustomer, setCurrentCustomer] = React.useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      const { data: allCustomers } = await getCustomers();

      const customersToDelete = allCustomers.filter((customer) =>
        ids.includes(customer.id)
      );

      const checkInvoicesForCustomers = async (customers) => {
        const results = await Promise.all(
          customers.map(async (customer) => {
            const { data: invoices } = await getInvoice();
            const hasInvoices = invoices.some(
              (invoice) => invoice.customerName === customer.name
            );
            return { id: customer.id, name: customer.name, hasInvoices };
          })
        );
        return results;
      };

      const invoiceChecks = await checkInvoicesForCustomers(customersToDelete);
      const customersWithInvoices = invoiceChecks.filter(
        (check) => check.hasInvoices
      );

      if (customersWithInvoices.length > 0) {
        const namesWithInvoices = customersWithInvoices.map(
          (check) => check.name
        );
        throw new Error(
          `Cannot delete customers with existing invoices: ${namesWithInvoices.join(
            ", "
          )}`
        );
      }

      await Promise.all(ids.map((id) => deleteCustomer(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setSelectedIds([]);
      toast.success("Customer(s) successfully deleted");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const createMutation = useMutation({
    mutationFn: async (newCustomer) => {
      const createdCustomer = await createCustomer(newCustomer);
      return createdCustomer;
    },
    onSuccess: (createdCustomer) => {
      queryClient.setQueryData(["customers"], (oldData) => {
        return oldData ? [...oldData, createdCustomer] : [createdCustomer];
      });
      setIsCreateModalOpen(false);
      toast.success("Customer successfully created");
    },
    onError: (error) => {
      toast.error(`Error creating Customer: ${error.message}`);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (id && Object.keys(updates).length > 0) {
        await editCustomer({ id, ...updates });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setIsEditModalOpen(false);
      toast.success("Customer successfully edited");
    },
    onError: (error) => {
      console.log("Error editing customer", error);
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
      const selectedCustomer = customers.find(
        (customer) => customer.id === selectedIds[0]
      );
      setCurrentCustomer(selectedCustomer);
      setIsEditModalOpen(true);
    } else {
      toast.error("Please select a single customer to edit.");
    }
  };

  const handleConfirmEdit = (updates) => {
    if (currentCustomer) {
      const { id } = currentCustomer;
      editMutation.mutate({ id, ...updates });
      setCurrentCustomer(null);
    } else {
      toast.error("No customer selected for editing");
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = (newCustomer) => {
    createMutation.mutate(newCustomer);
    setIsCreateModalOpen(false);
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  const filteredCustomers = React.useMemo(
    () =>
      customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [customers, searchQuery]
  );

  const totalPages = Math.ceil(count / pageSize);

  if (isLoading) return <Spinner />;
  if (isError)
    return <div>Error loading customers. Please try again later.</div>;

  return (
    <>
      <div className="table" role="table" aria-label="Customers Table">
        <header className="table-header-customers" role="rowgroup">
          <div role="columnheader" aria-label="Name">
            Name
          </div>
          <div
            role="columnheader"
            aria-label="Surname"
            style={{ textAlign: "center" }}
          >
            Surname
          </div>
          <div
            role="columnheader"
            aria-label="Address"
            style={{ textAlign: "center" }}
          >
            Address
          </div>
          <div
            role="columnheader"
            aria-label="Age"
            style={{ textAlign: "center" }}
          >
            Age
          </div>
        </header>
        {filteredCustomers.map((customer) => (
          <CustomersRow
            key={String(customer.id)}
            customer={{ ...customer, id: String(customer.id) }}
            isSelected={selectedIds.includes(customer.id)}
            onClick={() => handleRowClick(customer.id)}
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
        selected={selectedIds}
        onDelete={handleDelete}
        onCreate={handleOpenCreateModal}
        onEdit={handleOpenEditModal}
        pageType="customers"
      />
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ModalCreateCustomer
        isOpen={isCreateModalOpen}
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelCreate}
      />
      <ModalEditCustomer
        isOpen={isEditModalOpen}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        customer={currentCustomer}
      />
    </>
  );
}

CustomersTable.propTypes = {
  searchQuery: PropTypes.string,
  multipleSelect: PropTypes.bool,
};

export default CustomersTable;
