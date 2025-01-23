import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { getSellers } from "../../services/apiSellers";
import { getCustomers } from "../../services/apiCustomers";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 28px;
  width: 30rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ButtonDiscard = styled.button`
  border: 1px solid #f9c74f;
  background-color: #ffffe0;
  color: black;
  width: 50%;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 8px;
  padding: 0.5rem;

  &:hover {
    background-color: #f9c74f;
    color: white;
  }
`;

const ButtonSave = styled.button`
  background-color: #dcfcdc;
  border: 1px solid #2f8f2f;
  color: black;
  width: 50%;
  transition: background-color 0.3s, color 0.3s;
  margin-left: 1rem;
  border-radius: 8px;
  padding: 0.5rem;

  &:hover {
    background-color: #2f8f2f;
    color: white;
  }
`;

const Label = styled.label`
  color: black;
  margin-top: 1rem;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  border-radius: 6px;
  border-color: #bdbdbd;
  padding: 0.5rem;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 6px;
  border-color: #bdbdbd;
  padding: 0.5rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

function ModalEditInvoice({ isOpen, onConfirm, onCancel, invoice }) {
  const ref = useRef();
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      sellerId: "",
      customerId: "",
      date: "",
      amount: 0,
      ...invoice,
    },
  });

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
          console.error("Failed to fetch sellers or customers", error);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (invoice && typeof invoice === "object") {
      reset(invoice);
    }
  }, [invoice, reset]);

  const onSubmit = (data) => {
    const seller = sellers.find((s) => s.id === parseInt(data.sellerId));
    const customer = customers.find((c) => c.id === parseInt(data.customerId));

    if (!seller) {
      console.error("Invalid seller selected.");
      return;
    }

    if (!customer) {
      console.error("Invalid customer selected.");
      return;
    }

    const invoiceData = {
      ...data,
      sellerId: seller.id,
      customerId: customer.id,
    };

    onConfirm(invoiceData);
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
    <ModalOverlay>
      <ModalContent
        ref={ref}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2 id="modal-title">Edit Invoice</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label>
            Seller Name:
            <Select
              {...register("sellerId", { required: "Seller is required" })}
            >
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.companyName}
                </option>
              ))}
            </Select>
            {errors.sellerId && <span>{errors.sellerId.message}</span>}
          </Label>
          <Label>
            Customer Name:
            <Select
              {...register("customerId", { required: "Customer is required" })}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Select>
            {errors.customerId && <span>{errors.customerId.message}</span>}
          </Label>
          <Label>
            Date:
            <Input
              type="date"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && <span>{errors.date.message}</span>}
          </Label>
          <Label>
            Amount:
            <Input
              type="number"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0, message: "Amount must be positive" },
              })}
              placeholder="Enter amount"
            />
            {errors.amount && <span>{errors.amount.message}</span>}
          </Label>
          <ButtonGroup>
            <ButtonDiscard type="button" onClick={onCancel}>
              Discard
            </ButtonDiscard>
            <ButtonSave type="submit">Save</ButtonSave>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

ModalEditInvoice.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  invoice: PropTypes.object,
};

export default ModalEditInvoice;
