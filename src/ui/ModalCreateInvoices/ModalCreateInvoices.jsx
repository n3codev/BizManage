import "./ModalCreateInvoices.css";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createInvoices } from "../../services/apiInvoices";
import { useEffect, useRef, useState } from "react";
import { getSellers } from "../../services/apiSellers";
import { getCustomers } from "../../services/apiCustomers";

function ModalCreateInvoices({ isOpen, onConfirm, onCancel }) {
  const queryClient = useQueryClient();
  const ref = useRef();
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [sellersData, customersData] = await Promise.all([
            getSellers(),
            getCustomers(),
          ]);
          setSellers(sellersData.data);
          setCustomers(customersData.data);
        } catch (error) {
          toast.error("Failed to fetch data.");
        }
      };

      fetchData();
    }
  }, [isOpen]);

  const mutation = useMutation(createInvoices, {
    onSuccess: () => {
      queryClient.invalidateQueries("invoices");
      toast.success("Invoice created successfully!");
      onConfirm();
    },
    onError: () => {
      toast.error("Failed to create invoice.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const seller = sellers.find((s) => s.id === parseInt(data.sellerId));
    const customer = customers.find((c) => c.id === parseInt(data.customerId));

    if (!seller || !seller.isActive) {
      toast.error("Invalid or inactive seller selected.");
      return;
    }

    if (!customer) {
      toast.error("Invalid customer selected.");
      return;
    }

    const invoiceData = {
      ...data,
      sellerId: seller.id,
      customerId: customer.id,
    };

    mutation.mutate(invoiceData);
    reset();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        ref={ref}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2 id="modal-title">Create Invoice</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label">
            Seller Name:
            <select
              className="Input"
              {...register("sellerId", { required: "Seller is required" })}
            >
              <option value="">Select a seller</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.companyName}
                </option>
              ))}
            </select>
            {errors.sellerId && <span>{errors.sellerId.message}</span>}
          </label>
          <label className="label">
            Customer Name:
            <select
              className="Input"
              {...register("customerId", { required: "Customer is required" })}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && <span>{errors.customerId.message}</span>}
          </label>
          <label className="label">
            Date:
            <input
              className="Input"
              type="date"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && <span>{errors.date.message}</span>}
          </label>
          <label className="label">
            Amount:
            <input
              className="Input"
              type="number"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0, message: "Amount must be positive" },
              })}
              placeholder="Enter amount"
            />
            {errors.amount && <span>{errors.amount.message}</span>}
          </label>
          <div className="button-group">
            <button className="button-discard" type="button" onClick={onCancel}>
              Discard
            </button>
            <button
              className="button-save"
              type="submit"
              disabled={mutation.isLoading}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalCreateInvoices.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ModalCreateInvoices;
