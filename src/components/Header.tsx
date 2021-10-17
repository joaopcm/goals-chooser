import { Box, Flex, Heading } from '@chakra-ui/react'

export default function Header() {
  return (
    <Box
      as="header"
      height="5rem"
      boxShadow="xl"
      backgroundColor="cyan.500"
      color="white"
    >
      <Flex
        maxWidth="1120px"
        height="5rem"
        marginRight="auto"
        marginLeft="auto"
        paddingRight="2rem"
        paddingLeft="2rem"
        alignItems="center"
      >
        <Heading
          fontSize="3xl"
          fontWeight="bold"
          letterSpacing="tight"
        >
          Qual o próximo rolê?
        </Heading>
      </Flex>
    </Box>
  )
}