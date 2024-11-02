import * as Yup from 'yup';

export const PatientPharmacyDrugValidationSchema = Yup.object({
  quantity: Yup.string()
    .required('Quantity is required')
    .matches(/^[0-9]+$/, 'Must be only digits'),
});

export const DrugItemValidationSchema = Yup.object({
  item_name: Yup.string().required('Name is required'),
  inventory_type: Yup.string(),
  item_manufacturer: Yup.string(),
  item_tax: Yup.string(),
  item_hsn: Yup.string().required('Code is required'),
  item_category: Yup.string().required('Category is required'),
  item_pack_size: Yup.string().required('Pack size is required'),
  item_units: Yup.string().required('Units is required'),
  item_msq: Yup.string(),
});

export const ManufacturerValidationSchema = Yup.object({
  item_manufacturer: Yup.string().required('Manufacturer name is required'),
  inventory_type: Yup.string(),
  tax_category: Yup.string(),
  contact_person: Yup.string().required('Contact person is required'),
  contact_no: Yup.string().required('Contact number is required'),
  pincode: Yup.string().required('Pincode is required'),
  apgst_no: Yup.string().required('APGST number is required'),
  cst_no: Yup.string().required('CST number is required'),
  tin_no: Yup.string().required('Tin number is required'),
  pan_no: Yup.string().required('Pan number is required'),
});

export const ItemOrderValidationSchema = Yup.object({
  order_date: Yup.string(),
  placed_by: Yup.string(),
  transfer_from: Yup.string().required('Transfer from is required'),
  transfer_to: Yup.string().required('Transfer to is required'),
  item_name: Yup.string().required('Item name is required'),
  qty: Yup.string().required('Quanitity is required'),
  notes: Yup.string(),
});

export const AddTaxBracketValidationSchema = Yup.object({
  taxRate: Yup.string().required('Tax rate is required'),
  notes: Yup.string(),
});

export const AddDrugLocationValidationSchema = Yup.object({
  location: Yup.string().required('Location is required'),
  notes: Yup.string(),
});

export const AddDrugVendorValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  gst: Yup.string(),
  contact: Yup.object().shape({
    person: Yup.string(),
    phone: Yup.string().required('Phone number is required'),
    email: Yup.string().email('Invalid email format'),
  }),
  pan: Yup.string(),
  tin: Yup.string(),
  dl: Yup.string(),
  address: Yup.object().shape({
    addressLine1: Yup.string(),
    addressLine2: Yup.string(), // Optional
    pincode: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
  }),
  remarks: Yup.string(), // Optional
  status: Yup.boolean().required('Status is required'),
});

export const AddDrugManufacturerValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.array().of(Yup.object().required()).nullable(),
  taxRate: Yup.object().nullable(),
  cst: Yup.string(),
  apgst: Yup.string(),
  pan: Yup.string(),
  tin: Yup.string(),
  contact: Yup.object().shape({
    person: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email('Invalid email format'),
    website: Yup.string().optional(),
  }),
  address: Yup.object().shape({
    addressLine1: Yup.string(),
    addressLine2: Yup.string().optional(),
    pincode: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
  }),
  status: Yup.boolean(),
});

export const AddDrugCategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  notes: Yup.string(),
});

export const AddSourceValidationSchema = Yup.object().shape({
  IDName: Yup.string().required('IDName is required'),

  Source: Yup.string().required('Source is required'),
});

export const AddIDtypeValidationSchema = Yup.object().shape({
  IDName: Yup.string().required('IDName is required'),

  Format: Yup.string().required('Source is required'),
});

export const ReferralDoctorValidationSchema = Yup.object().shape({
  doctorName: Yup.string().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Contact Number must be a valid phone number')
    .required('Contact Number is required'),
  city: Yup.string().required('City is required'),
  speciality: Yup.string().required('Speciality is required'),
});

export const AddDrugItemValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  hsnCode: Yup.string().required('HSN code is required'),
  category: Yup.object().nullable(),
  type: Yup.object()
    .nullable()
    .when('category', ([category], schema) => {
      if (
        (category && category?.name === 'Medication') ||
        (category && category?.name === 'Emergency Medication')
      ) {
        return schema.required(
          "Type is required when category is 'Medication' or 'Emergency Medication'",
        );
      }
      return schema.notRequired();
    }),
  packSize: Yup.string().nullable(),
  taxRate: Yup.object().nullable(),
  manufacturer: Yup.object().nullable(),
  status: Yup.boolean().required('Status is required'),
});

export const AddDrugTypeValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  shortcode: Yup.string().required('Short code is required').max(3).uppercase(),
  notes: Yup.string(),
});

// Purchase Order
const addPurchaseOrderItemSchema = Yup.object().shape({
  item: Yup.mixed().nullable().required('Item is required'),
  packSize: Yup.number().nullable().min(0, 'Pack size cannot be negative'),
  quantity: Yup.number()
    .nullable()
    .min(0, 'Quantity cannot be negative')
    .required('Quantity is required'),
  mrp: Yup.number().nullable().min(0, 'MRP cannot be negative'),
  mrpPerPack: Yup.number()
    .nullable()
    .min(0, 'MRP per unit cannot be negative')
    .required('MRP per Unit is required'),
  buyPrice: Yup.number()
    .nullable()
    .min(0, 'Buy price cannot be negative')
    .required('Buy price is required'),
  tax: Yup.number().nullable().min(0, 'Tax cannot be negative'),
});
export const addPurchaseOrderValidationSchema = Yup.object().shape({
  order_date: Yup.date().nullable().required('Order date is required'),
  vendor: Yup.mixed().nullable().required('Vendor is required'), // Adjust based on how you determine if a vendor is selected
  items: Yup.array()
    .of(addPurchaseOrderItemSchema)
    .required('At least one item is required'),
  subTotal: Yup.number().nullable().min(0, 'Subtotal cannot be negative'),
  tax: Yup.number().nullable().min(0, 'Tax cannot be negative'),
  discount: Yup.number().nullable().min(0, 'Discount cannot be negative'),
  otherCharges: Yup.number()
    .nullable()
    .min(0, 'Other charges cannot be negative'),
  netAmount: Yup.number().nullable().min(0, 'Net amount cannot be negative'),
});

// Purchase Order Invoice
const addPurchaseOrderInvoiceItemSchema = Yup.object().shape({
  item: Yup.mixed().nullable().required('Item is required'),
  packSize: Yup.number().nullable().min(0, 'Pack size cannot be negative'),
  quantity: Yup.number()
    .nullable()
    .min(0, 'Quantity cannot be negative')
    .required('Quantity is required'),
  mrp: Yup.number().nullable().min(0, 'MRP cannot be negative'),
  mrpPerPack: Yup.number()
    .nullable()
    .min(0, 'MRP per unit cannot be negative')
    .required('MRP per Unit is required'),
  buyPrice: Yup.number()
    .nullable()
    .min(0, 'Buy price cannot be negative')
    .required('Buy price is required'),
  tax: Yup.number().nullable().min(0, 'Tax cannot be negative'),
  batchNo: Yup.string().required('Batch number is required'),
  expiryDate: Yup.date().nullable().required('Expiry date is required'),
});
export const addPurchaseOrderInvoiceValidationSchema = Yup.object().shape({
  order_date: Yup.date().nullable().required('Order date is required'),
  vendor: Yup.mixed().nullable().required('Vendor is required'), // Adjust based on how you determine if a vendor is selected
  items: Yup.array()
    .of(addPurchaseOrderInvoiceItemSchema)
    .required('At least one item is required'),
  subTotal: Yup.number().nullable().min(0, 'Subtotal cannot be negative'),
  tax: Yup.number().nullable().min(0, 'Tax cannot be negative'),
  discount: Yup.number().nullable().min(0, 'Discount cannot be negative'),
  otherCharges: Yup.number()
    .nullable()
    .min(0, 'Other charges cannot be negative'),
  netAmount: Yup.number().nullable().min(0, 'Net amount cannot be negative'),
});

// Internal Order
const addInternalOrderItemSchema = Yup.object().shape({
  item: Yup.mixed().nullable().required('Item is required'),
  transferFrom: Yup.object().required('Transfer from is required'),
  transferTo: Yup.object().required('Transfer to is required'),
  quantity: Yup.number()
    .nullable()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  notes: Yup.string(),
});

export const addInternalOrderValidationSchema = Yup.object().shape({
  date: Yup.date().nullable().required('Date is required'),

  items: Yup.array()
    .of(addInternalOrderItemSchema)
    .required('At least one item is required'),
});
