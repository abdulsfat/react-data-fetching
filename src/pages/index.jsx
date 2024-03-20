import Head from "next/head";
import { Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, FormControl, FormLabel, Input, VStack, Button, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useDeleteProduct, useFetchProducts, useEditProduct, useCreateProduct } from "@/features/product";

export default function Home() {
  // pop up-nya punya ckara
  const toast = useToast();

  // Buat ngeread
  const {
    data,
    isLoading: productsIsLoading,
    refetch: refetchProduct,
  } = useFetchProducts({
    onError: () => {
      toast: ({
        title: "Ada kesalahan terjadi",
        status: "error",
      });
    },
  });

  // Buat ngambil data dari form (Button)
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      image: "",
      id: 0,
    },
    // Button
    onSubmit: () => {
      const { name, price, description, image, id } = formik.values;

      // Membuat kondisi dia mau bikin apa ngerubah
      if (id) {
        // Memalukan PATCH /product/{id}
        editProduct({
          name,
          price: parseInt(price),
          description,
          image,
          id,
        });
        toast({
          title: "Product eddited",
          status: "success",
        });
      } else {
        // Melakukan POST /Product
        createProduct({
          name,
          price: parseInt(price),
          description,
          image,
        });
        toast({
          title: "Product added",
          status: "success",
        });
      }

      // reset form setelah submit
      formik.setFieldValue("name", "");
      formik.setFieldValue("price", 0);
      formik.setFieldValue("description", "");
      formik.setFieldValue("image", "");
      formik.setFieldValue("id", 0);
    },
  });

  //  Buat Bikin product baru nih
  const { mutate: createProduct, isLoading: createProductIsLoading } = useCreateProduct({
    onSuccess: () => {
      refetchProduct();
    },
  });

  // Buat ngehandel pereditan data
  const { mutate: editProduct, isLoading: editProductIsLoading } = useEditProduct({
    onSuccess: () => {
      refetchProduct();
    },
  });

  // Buat ngehandel pengiriman data
  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  // validasi mengapus ygy
  const confimationDelete = (productId) => {
    const shouldDelete = confirm("Are u sure?");

    if (shouldDelete) {
      deleteProduct(productId);
      toast({
        title: "Deleted Product",
        status: "info",
      });
    } else {
      toast({
        title: "Cancel Deleted Product",
        status: "success",
      });
    }
  };

  // Buat ngehapus nich
  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProduct();
    },
  });

  // Buat Ngedit
  const onEditClick = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("image", product.image);
  };

  // Ini buat ngerender data ke frontend
  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>{product.name}</Td>
          <Td>{product.price}</Td>
          <Td>{product.description}</Td>
          <Td>
            <Button onClick={() => onEditClick(product)} colorScheme="cyan">
              Edit
            </Button>
          </Td>
          <Td>
            <Button onClick={() => confimationDelete(product.id)} colorScheme="red">
              Delete
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Heading>Hello World!</Heading>
          <Table mb="6">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th colSpan={2}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* {isLoading ? <Spinner /> : null} */}
              {productsIsLoading && (
                <Tr>
                  <Td>
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {renderProducts()}
            </Tbody>
          </Table>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing="3">
              <FormControl>
                <FormLabel>Product ID</FormLabel>
                <Input onChange={handleFormInput} name="id" value={formik.values.id} />
              </FormControl>
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input onChange={handleFormInput} name="name" value={formik.values.name} />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input onChange={handleFormInput} name="price" value={formik.values.price} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input onChange={handleFormInput} name="description" value={formik.values.description} />
              </FormControl>
              <FormControl>
                <FormLabel>Image</FormLabel>
                <Input onChange={handleFormInput} name="image" value={formik.values.image} />
              </FormControl>
              {createProductIsLoading || editProductIsLoading ? <Spinner></Spinner> : <Button type="submit">Submit Product</Button>}
            </VStack>
          </form>
        </Container>
      </main>
    </>
  );
}
