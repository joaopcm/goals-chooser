import { useState, useMemo } from 'react';
import { GetServerSideProps } from "next";
import {
  Heading,
  Text,
  Select as SelectInput,
  Button,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import { notion, Title, MultiSelect, Select } from '../services/notion'
import SEO from '../components/SEO'

type Type = {
  id: string;
  name: string;
}

type Goal = {
  id: string;
  name: string;
  types: Type[];
  status: 'pending' | 'done';
}

interface HomeProps {
  goals: Goal[];
}

export default function Home({ goals }: HomeProps) {
  const [numberFilter, setNumberFilter] = useState<number>();
  const [colorFilter, setColorFilter] = useState<string>();
  const [characterFilter, setCharacterFilter] = useState<string>();
  const [typeFilter, setTypeFilter] = useState<string>();
  const [showValidations, setShowValidations] = useState(false);
  const [result, setResult] = useState<Goal>();
  const [noResults, setNoResults] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isValid = useMemo(() => {
    return numberFilter &&  colorFilter && characterFilter && typeFilter
  }, [numberFilter, colorFilter, characterFilter, typeFilter])

  function closeModal() {
    setShowValidations(false);
    setResult(undefined);
    setNoResults(false);
    onClose();
  }

  function isOdd(value: number) {
    return value % 2 !== 0;
  }

  function handleGenerateResults() {
    setShowValidations(true);
    setNoResults(false);

    if (!isValid) {
      return
    }

    const possibleGoals = goals.filter(goal =>
      goal.types.map(type => type.name).includes(typeFilter!) &&
      goal.status === 'pending'
    );

    if (!possibleGoals.length) {
      return setNoResults(true);
    }

    if (possibleGoals.length === 1) {
      setResult(possibleGoals[0]);
    } else {
      let randomGoal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];

      if (isOdd(numberFilter!)) {
        randomGoal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
      }

      if (!isOdd(colorFilter!.length)) {
        randomGoal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
      }

      if (isOdd(characterFilter!.length)) {
        randomGoal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
      }

      setResult(randomGoal);
    }

    onOpen();
  }

  return (
    <>
      <SEO title="Qual o pr??ximo rol???" />

      <Modal isOpen={isOpen} onClose={closeModal} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Se liga nesse rol??!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={2} alignItems="flex-start">
              <span>Que tal voc??s abra??arem o rol?? "<strong>{result?.name}</strong>"?</span>
              <Text color="gray.500" fontWeight="bold">OBS: Lembre-se que eu te amo muito ??????</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} colorScheme="cyan" color="white">
              Fechado!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Heading fontSize="2xl">Descubra o pr??ximo rol?? da Rhaiany</Heading>

      <VStack spacing="2rem" mt="2rem" alignItems="flex-start">
        {noResults && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Sem resultados!</AlertTitle>
            <AlertDescription>N??o foi poss??vel encontrar um rol?? de acordo com as suas respostas.</AlertDescription>
          </Alert>
        )}

        <SelectInput
          placeholder="O que voc?? quer fazer hoje?"
          size="lg"
          value={typeFilter}
          onChange={event => setTypeFilter(event.target.value)}
          isInvalid={showValidations && !typeFilter}
          isRequired
        >
          <option value="experience">Ter uma experi??ncia diferenciada</option>
          <option value="food">Comer bem</option>
          <option value="content">Assistir algo</option>
          <option value="place">Conhecer um lugar</option>
        </SelectInput>

        <SelectInput
          placeholder="Escolha um n??mero"
          size="lg"
          value={numberFilter}
          onChange={event => setNumberFilter(Number(event.target.value))}
          isInvalid={showValidations && !numberFilter}
          isRequired
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </SelectInput>

        <SelectInput
          placeholder="Escolha uma cor"
          size="lg"
          value={colorFilter}
          onChange={event => setColorFilter(event.target.value)}
          isInvalid={showValidations && !colorFilter}
          isRequired
        >
          <option value="blue">Azul</option>
          <option value="black">Preto</option>
          <option value="red">Vermelho</option>
          <option value="green">Verde</option>
          <option value="yellow">Amarelo</option>
          <option value="orange">Laranja</option>
        </SelectInput>

        <SelectInput
          placeholder="Escolha um personagem"
          size="lg"
          value={characterFilter}
          onChange={event => setCharacterFilter(event.target.value)}
          isInvalid={showValidations && !characterFilter}
          isRequired
        >
          <option value="mikey">Mikey</option>
          <option value="draken">Draken</option>
          <option value="takemichi">Takemichi</option>
          <option value="hinata">Hinata</option>
          <option value="naruto">Naruto</option>
          <option value="sasuke">Sasuke</option>
          <option value="sakura">Sakura</option>
          <option value="kakashi">Kakashi</option>
        </SelectInput>

        <Button size="lg" colorScheme="cyan" color="white" onClick={handleGenerateResults}>Descobrir</Button>
      </VStack>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { NOTION_API_DATABASE_ID } = process.env

  if (!NOTION_API_DATABASE_ID) {
    return {
      props: {}
    }
  }

  const response = await notion.databases.query({ database_id: NOTION_API_DATABASE_ID })
  const goals = response.results.map(page => {
    return {
      id: page.id,
      name: (page.properties.Name as Title).title[0]?.plain_text,
      types: (page.properties.Type as MultiSelect).multi_select,
      status: (page.properties.Status as Select).select.name,
    }
  })

  return {
    props: {
      goals: goals
    }
  }
}
