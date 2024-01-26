import DefiIcon from "@/components/DefiIcon";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  ClickAwayListener,
  FormControl,
  FormControlProps,
  FormHelperTextProps,
  ListItem,
  MenuItem,
  OutlinedInput,
  Typography,
  useTheme,
} from "@mui/material";
import Select, { SelectProps } from "@mui/material/Select";
import React, { FC, useState } from "react";

export interface IKeyValuePair {
  key: any;
  value: string;
}

interface IBaseProps {
  label?: string;
  searchFieldPlaceholder?: string;
  removeSelectionText?: string;
  helperText?: string;
  formControlProps?: FormControlProps;
  formHelperTextProps?: FormHelperTextProps;
  maxVisibleOptions?: number;
  showAll?: boolean;
  noRemoveSelectionOption?: boolean;
}

interface SelectNetworkProps {
  id: string;
  value?: string | undefined;
  label?: string;
  size?: "small" | "medium";
  width?: number;
  height?: number;
  heading?: string;
  searchDisabled?: boolean;
}

interface IDefaultKeyValuePair extends IBaseProps {
  options: IKeyValuePair[];
}

interface ICustomKeyValuePair extends IBaseProps {
  keyPropFn: (option: IKeyValuePair | any) => any;
  valuePropFn: (option: IKeyValuePair | any) => string | number;
  options: any[];
}

export type SearchableSelectProps = (
  | IDefaultKeyValuePair
  | ICustomKeyValuePair
) &
  SelectProps &
  SelectNetworkProps;

interface IClickAwayListenerWrapperProps {
  searchFieldPlaceholder: string | undefined;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}
const SearchFieldWrapper: FC<IClickAwayListenerWrapperProps> = ({
  searchFieldPlaceholder,
  setQuery,
}) => {
  return (
    <ClickAwayListener onClickAway={() => null}>
      <ListItem sx={{ padding: 0 }}>
        <OutlinedInput
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          placeholder={searchFieldPlaceholder || "Search"}
          onKeyDown={(e) => e.stopPropagation()}
          sx={{
            height: 56,
            "& .MuiOutlinedInput-input": {
              textAlign: "center",
            },
          }}
          startAdornment={<SearchIcon />}
        />
      </ListItem>
    </ClickAwayListener>
  );
};

const SelectNetwork: FC<SearchableSelectProps> = (props) => {
  const [query, setQuery] = useState<string>("");
  const theme = useTheme();

  const {
    label,
    error,
    searchFieldPlaceholder,
    removeSelectionText,
    value,
    helperText,
    options,
    formControlProps,
    formHelperTextProps,
    showAll,
    maxVisibleOptions,
    noRemoveSelectionOption,
    width,
    height,
    id,
    size,
    heading,
    searchDisabled = false,
    ...rest
  } = props;

  let { keyPropFn, valuePropFn } = props as ICustomKeyValuePair & SelectProps;

  delete (rest as any).keyPropFn;
  delete (rest as any).valuePropFn;

  if (!keyPropFn && !valuePropFn) {
    keyPropFn = (option: IKeyValuePair) => option.key;
    valuePropFn = (option: IKeyValuePair) => option.value;
  }

  // to filter, valuePropFn returns the selected value
  // convert to lowercase and compare against query.
  function renderFilteredOptions() {
    let filteredOptions =
      options &&
      options.filter &&
      options.filter((option: IKeyValuePair | any) => {
        return (
          !valuePropFn(option) ||
          (valuePropFn(option) &&
            valuePropFn(option)
              .toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) !== -1)
        );
      });

    if (!showAll) {
      filteredOptions = filteredOptions.slice(0, maxVisibleOptions || 20);

      const selectedOption = options.find(
        (option) => value === keyPropFn(option),
      );

      if (selectedOption) {
        if (filteredOptions.indexOf(selectedOption) === -1) {
          filteredOptions.push(selectedOption);
        }
      }
    }

    return filteredOptions.map((option: IKeyValuePair | any) => {
      const searchVal = valuePropFn(option).toString();
      return (
        <MenuItem
          sx={{
            width: width,
            height: 56,
          }}
          key={keyPropFn(option)}
          value={keyPropFn(option)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {option.logo && (
              <DefiIcon width={24} height={24} icon={option.logo} />
            )}
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <Typography mx={1}>{searchVal}</Typography>
            </Box>
          </Box>
        </MenuItem>
      );
    });
  }
  return (
    <FormControl
      sx={{
        width: "100%",
        ".MuiPaper-root": {
          background: "linear-gradient(180deg, #130517 0%, #170514 100%)",
        },
      }}
      margin="normal"
      {...formControlProps}
    >
      {heading && (
        <Typography
          variant="h3"
          fontFamily="BIN Regular"
          sx={{
            marginBottom: (theme) => theme.spacing(3),
          }}
        >
          {heading}
        </Typography>
      )}

      <Select
        value={value}
        labelId={`${id}-label`}
        id={id}
        sx={{
          background: theme.palette.background.paper,
          width,
          height,
          "& .MuiSvgIcon-root": {
            fill: theme.palette.primary.main,
          },
          padding: 0,
        }}
        size={size}
        fullWidth
        {...rest}
      >
        {!searchDisabled && (
          <SearchFieldWrapper
            searchFieldPlaceholder={searchFieldPlaceholder}
            setQuery={setQuery}
          />
        )}
        {searchDisabled && (
          <MenuItem
            sx={{
              width: width,
              height: 56,
            }}
            value="select-network"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <Typography mx={1}>Select network</Typography>
              </Box>
            </Box>
          </MenuItem>
        )}
        {renderFilteredOptions()}
      </Select>
    </FormControl>
  );
};

export default SelectNetwork;
