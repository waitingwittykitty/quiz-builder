import { FieldProps } from 'formik';
import { useEffect, useMemo } from 'react';
import OriginSelect from 'react-select';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends FieldProps {
  options: Option[];
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = false,
  disabled = false,
}: SelectProps) => {
  useEffect(() => {
    if (
      (typeof field.value === 'object' && !isMulti) ||
      (['string', 'number'].includes(typeof field.value) && isMulti)
    ) {
      form.setFieldValue(field.name, isMulti ? [] : null);
    }
    // eslint-disable-next-line
  }, [isMulti]);

  const onChange = (option: Option | Option[]) => {
    form.setFieldValue(
      field.name,
      isMulti
        ? (option as Option[]).map((item: Option) => item.value)
        : (option as Option).value,
    );
  };

  const value = useMemo(() => {
    if (options) {
      return (
        (isMulti
          ? options.filter(
              option =>
                field.value instanceof Array && field.value.indexOf(option.value) >= 0,
            )
          : options.find(option => option.value === field.value)) || null
      );
    } else {
      return isMulti ? [] : (null as any);
    }
  }, [field, isMulti, options]);

  return (
    <OriginSelect
      className={className}
      name={field.name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      isDisabled={disabled}
    />
  );
};

export default Select;
