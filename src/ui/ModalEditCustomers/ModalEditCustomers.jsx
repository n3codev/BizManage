import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { editCustomer } from "../../services/apiCustomers";
import "./ModalEditCustomers.css";
function ModalEditCustomer({ isOpen, onConfirm, onCancel, customer }) {
  const queryClient = useQueryClient();
  const ref = useRef();

  const mutation = useMutation(editCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customer");
      toast.success("Customer updated successfully!");
      onConfirm();
    },
    onError: () => {
      toast.error("Failed to update customer.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      address: "",
      age: null,
      ...customer,
    },
  });

  useEffect(() => {
    if (customer && typeof customer === "object") {
      reset(customer);
    }
  }, [customer, reset]);

  const onSubmit = (data) => {
    mutation.mutate({ ...customer, ...data });
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

  if (!isOpen || !customer) return null;

  return (
    <div className="edit-modal-overlay">
      <div
        className="edit-modal-content"
        ref={ref}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2 id="modal-title">Edit Customer</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="edit-label">
            Name:
            <input
              className="edit-input"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter name"
            />
            {errors.name && <span>{errors.name.message}</span>}
          </label>
          <label className="edit-label">
            Surname:
            <input
              className="edit-input"
              {...register("surname", { required: "Surname is required" })}
              placeholder="Enter surname"
            />
            {errors.surname && <span>{errors.surname.message}</span>}
          </label>
          <label className="edit-label">
            Address:
            <input
              className="edit-input"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter address"
            />
            {errors.address && <span>{errors.address.message}</span>}
          </label>
          <label className="edit-label">
            Age:
            <input
              className="edit-input"
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 0, message: "Age must be a positive number" },
              })}
              placeholder="Enter age"
            />
            {errors.age && <span>{errors.age.message}</span>}
          </label>
          <div className="edit-button-group">
            <button
              className="edit-button-discard"
              type="button"
              onClick={onCancel}
            >
              Discard
            </button>
            <button
              className="edit-button-save"
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

ModalEditCustomer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    surname: PropTypes.string,
    address: PropTypes.string,
    age: PropTypes.number,
  }),
};

export default ModalEditCustomer;
