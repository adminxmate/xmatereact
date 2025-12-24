import { AsyncPaginate } from "react-select-async-paginate";
import { searchHorses } from "../../api/horseApi";

const HorseDropdown = ({ value, onChange, placeholder }) => {
  const loadOptions = async (inputValue, loadedOptions, { page }) => {
    const { data, hasMore } = await searchHorses({
      query: inputValue,
      page,
      limit: 20,
    });

    const options = data.map((horse) => ({
      value: horse.id, // 👈 use horse.id here
      label: horse.foalingYear ? `${horse.name} (${horse.foalingYear})` : horse.name,
      horse, // 👈 keep full horse object if you want extra info later
    }));

    return {
      options,
      hasMore,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <AsyncPaginate
      value={
        value
          ? { value: value.id, label: value.label }
          : null
      }
      loadOptions={loadOptions}
      onChange={(selected) => onChange(selected ? selected : null)} // 👈 pass full selected option
      placeholder={placeholder}
      isClearable
      additional={{ page: 1 }}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "48px",
          borderRadius: "6px",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      menuPortalTarget={document.body}
      closeMenuOnBlur={true}
    />
  );
};

export default HorseDropdown;
