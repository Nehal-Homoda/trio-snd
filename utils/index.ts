import type { OrderOption } from "~/interfaces/user/orders/orderOptions.interface";
import NumberField from "~/components/base/forms/NumberField.vue";
import Location from "~/components/base/forms/Location.vue";
import DateField from "~/components/base/forms/DateField.vue";
import SelectImage from "~/components/base/forms/SelectImage.vue";
import PhoneField from "~/components/base/forms/PhoneField.vue";
import SelectField from "~/components/base/forms/SelectField.vue";
import TextField from "~/components/base/forms/TextField.vue";
import TimeField from "~/components/base/forms/TimeField.vue";
import ImageField from "~/components/base/forms/ImageField.vue";
import MultipleCheckBoxField from "~/components/base/forms/MultipleCheckBoxField.vue";
import FileField from "~/components/base/forms/FileField.vue";
import SelectFile from "~/components/base/forms/SelectFile.vue";
import DateTimeField from "~/components/base/forms/DateTimeField.vue";
import type { Option } from "~/interfaces/user/orders/order.interface";
import { useNotification } from "@kyvg/vue3-notification";
import QuantityMultiCheckBox from "~/components/base/forms/QuantityMultiCheckBox.vue";

export const dynamicTextFieldComponent = (orderOption: OrderOption | Option) => {
  // location
  //time
  //file
  //date
  //image
  //multi_image
  // number
  // select
  // text
  // multicheckbox
  // datetime
  // multiselect



  // "location" => Location;
  // "number" => NumberField;
  // "select" => SelectField;
  // "text" => TextField;
  // "multicheckbox" => MultipleCheckBoxField;
  // "multiselect" => MultipleCheckBoxField;
  // "date" => DateField;
  // "date_from" => DateField;
  // "date_to" => DateField;
  // "datetime" => DateTimeField;
  // "time" => TimeField;
  // "number" => PhoneField;
  // "image" => ImageField;
  // "multi_image" => ImageField;
  // "file" => FileField;



  if (orderOption.type === "location") return Location;
  if (orderOption.type === "number") return NumberField;
  if (orderOption.type === "select") return SelectField;
  if (orderOption.type === "text") return TextField;
  if (orderOption.type === "multicheckbox") return MultipleCheckBoxField;
  if (orderOption.type === "multiselect") return QuantityMultiCheckBox;
  if (orderOption.type === "date") return DateField;
  if (orderOption.type === "date_from") return DateField;
  if (orderOption.type === "date_to") return DateField;
  if (orderOption.type === "datetime") return DateTimeField;
  if (orderOption.type === "time") return TimeField;
  if (orderOption.type === "number") return PhoneField;
  if (orderOption.type === "image") return SelectImage;
  if (orderOption.type === "multi_image") return SelectImage;
  if (orderOption.type === "file") return SelectFile;

  return NumberField;
};
export const goTo = (path: string) => {
  const localePath = useLocalePath();
  const router = useRouter();

  router.push(localePath(path));
};
export const replaceTo = (path: string) => {
  const localePath = useLocalePath();
  const router = useRouter();

  router.replace(localePath(path));
};
export const getParam = (paramName: string) => {
  const urlParam = new URLSearchParams(window.location.search).get(paramName);

  return urlParam || null;
};

export const distanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => value * Math.PI / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance.toFixed(2);
}


export const fileToBase64Image = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // Split to get the base64 part
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Split to get the base64 part
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const filesToBase64 = (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(file => fileToBase64(file)));
};
export const filesToBase64Images = (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(file => fileToBase64Image(file)));
};


export const notifyAlert = (type: 'success' | 'error' | 'warn', title: string | undefined, text?: string | undefined) =>  {

  const {notify}=useNotification();


  notify({
    type: type,
    title: title,
    text: text
  })


}

export const byteToMb = (bytes: number) => {
  // Convert bytes to kilobytes (1 KB = 1024 bytes)
  const kb = bytes / 1024;
  // Convert kilobytes to megabytes (1 MB = 1024 KB)
  const mb = kb / 1024;
  return parseFloat(mb.toFixed(2));
}