import dynamic from "next/dynamic";

// --- Chakra-UI ---
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

// --- Motion Components ---
const MotionBox = dynamic(() => import("./MotionBox"));

// --- Form and Validations ---
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// --- Icons ---
import { FiGithub, FiSearch } from "react-icons/fi";

// --- Validation Schema and Type ---
const validationSchema = Yup.object().shape({
  address: Yup.string().required("address is required!"),
});

type FormType = Yup.InferType<typeof validationSchema>;

// --- Component Props Interface ---
interface ISearchProps {
  handleSearchAddress: (address?: string) => void;
}

export default function Search({
  handleSearchAddress,
}: ISearchProps): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema), mode: "onTouched" });

  const onSubmit = ({ address }: FormType) =>
    new Promise(() => setTimeout(() => handleSearchAddress(address), 500));

  return (
    <MotionBox w="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack spacing="2" w="full" alignItems="flex-start" py="2">
          <FormControl isInvalid={!!errors.address}>
            <InputGroup size="lg" variant="outline" borderColor="gray.600">
              <InputLeftElement
                pointerEvents="none"
                children={<FiGithub size="1.5rem" color="white" />}
              />
              <Input
                {...register("address")}
                type="text"
                placeholder="Search Contract..."
                color="whitesmoke"
                bg="gray.600"
                borderColor="gray.600"
                borderRadius="xl"
                focusBorderColor="purple.500"
                _placeholder={{ color: "gray.400" }}
                _hover={{ borderColor: "purple.300" }}
              />
            </InputGroup>
            {!errors.address ? (
              <FormHelperText>
                Insert a valid Contract Address to get the data
              </FormHelperText>
            ) : (
              <FormErrorMessage>
                {errors.address?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>

          <IconButton
            icon={<FiSearch />}
            type="submit"
            aria-label="Search"
            isLoading={isSubmitting}
            size="lg"
            borderRadius="xl"
            colorScheme="purple"
          />
        </HStack>
      </form>
    </MotionBox>
  );
}
