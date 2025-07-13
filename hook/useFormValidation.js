import { useState } from 'react';
import * as yup from 'yup';

export default function useFormValidation(initialValues, validationSchema, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Only validate fields defined in the schema
  const filterSchemaFields = (fieldValues) => {
    const schemaFields = Object.keys(validationSchema.fields);
    return schemaFields.reduce((acc, key) => {
      acc[key] = fieldValues[key];
      return acc;
    }, {});
  };

  const validate = async (fieldValues = values) => {
    const filteredValues = filterSchemaFields(fieldValues);
    console.log('Validating:', filteredValues); // <-- Add this
    try {
      await validationSchema.validate(filteredValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const formErrors = {};
      if (err.inner) {
        err.inner.forEach(e => {
          if (!formErrors[e.path]) formErrors[e.path] = e.message;
        });
      }
      setErrors(formErrors);
      return false;
    }
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const isValid = await validate();
    if (isValid && onSubmit) {
      console.log('Submitting values:', filterSchemaFields(values)); // <-- Add this
      await onSubmit(filterSchemaFields(values));
    }
    setSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    submitting,
    handleChange,
    handleSubmit,
    validate,
    setValues,
    setErrors,
    setTouched,
  };
} 