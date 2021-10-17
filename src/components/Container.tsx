import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <Box
      maxWidth="1120px"
      marginLeft="auto"
      marginRight="auto"
      paddingLeft="2rem"
      paddingRight="2rem"
      marginTop="2rem"
    >
      {children}
    </Box>
  )
}