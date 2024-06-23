import React from 'react'
import { ImageSourcePropType } from 'react-native'
import { Box, VStack, Heading, Image, useColorModeValue } from 'native-base'

interface Props {
  title: string
  image: ImageSourcePropType
  children: React.ReactNode
}

const Masthead = ({ title, image, children }: Props) => {
  return (
    <VStack h="240px" pb={5} background={useColorModeValue('warmGray.50', 'primary.900')}>
      <Image
        position="absolute"
        left={0}
        right={0}
        bottom={1}
        w="full"
        h="240px"
        resizeMode="cover"
        source={image}
        alt="masthead image"
        borderRadius={20}
      />
      {children}
      <Box flex={1} />
      <Heading color="white" p={6} size="xl">
        {title}
      </Heading>
    </VStack>
  )
}

export default Masthead