import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCustomer } from "../../services/apiCustomers";
import { useEffect } from "react";
import { useRef } from "react";
import "./ModalCreateCustomer.css";

function ModalCreateCustomer({ isOpen, onConfirm, onCancel }) {
  const queryClient = useQueryClient();
  const ref = useRef();

  const mutation = useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
      toast.success("Customer created successfully!");
      onConfirm();
    },
    onError: () => {
      toast.error("Failed to create customer.");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    onCancel();
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

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

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
        <h2 id="modal-title">Create Customer</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label">
            Name:
            <input
              className="input"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter name"
            />
            {errors.name && <span>{errors.name.message}</span>}
          </label>
          <label className="label">
            Surname:
            <input
              className="input"
              {...register("surname", { required: "Surname is required" })}
              placeholder="Enter surname"
            />
            {errors.surname && <span>{errors.surname.message}</span>}
          </label>
          <label className="label">
            Address:
            <input
              className="input"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter address"
            />
            {errors.address && <span>{errors.address.message}</span>}
          </label>
          <label className="label">
            Age:
            <input
              className="input"
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 0, message: "Age must be a positive number" },
              })}
              placeholder="Enter age"
            />
            {errors.age && <span>{errors.age.message}</span>}
          </label>
          <div className="button-group">
            <button
              className="button-discard"
              type="button"
              onClick={handleClose}
            >
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

ModalCreateCustomer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ModalCreateCustomer;
