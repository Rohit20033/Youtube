import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Flex,
  Heading,
  Text,
  Divider,
  Skeleton,
  Center,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import SingleVideoPage from './singlePageVideo';
import { Link } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [isPopular, setIsPopular] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handlePopular();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchTerm}&key=AIzaSyC8w_gn9_RbnZXGFsdTN7OUvgyFtbavvSk`
      );

      const data = await response.json();
      if (data.items) {
        setVideos(data.items);
        setIsPopular(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopular = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&order=viewCount&key=AIzaSyC8w_gn9_RbnZXGFsdTN7OUvgyFtbavvSk`
      );

      const data = await response.json();
      if (data.items) {
        setVideos(data.items);
        setIsPopular(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box bg="gray.900" color="white" minHeight="100vh">
        <Box p="4">
          <Flex justify="space-between" align="center">
            <Image src={"https://t3.ftcdn.net/jpg/03/00/38/90/360_F_300389025_b5hgHpjDprTySl8loTqJRMipySb1rO0I.jpg"} alt="YouTube Logo" w="120px" h="auto" />
            <Center>
            <InputGroup flex="1" ml="4" maxW="500px">
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                bg="white"
                color={"black"}
                borderRadius="md"
                py="3"
                px="4"
                focusBorderColor="gray.300"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <InputRightElement>
                <IconButton
                  icon={<SearchIcon />}
                  onClick={handleSearch}
                  aria-label="Search"
                  variant="outline"
                />
              </InputRightElement>
            </InputGroup>
            </Center>
          </Flex>
        </Box>
        <Container maxW="container.lg" px="4">
          <Heading mb="4" size="lg">
            {isPopular ? 'Popular Videos' : 'Search Results'}
          </Heading>
          <Flex flexWrap="wrap" justifyContent="space-between" mb="4">
            {isLoading ? (
              Array.from({ length: 20 }).map((_, index) => (
                <Skeleton
                  key={index}
                  w={['100%', 'calc(50% - 10px)', 'calc(33.33% - 10px)', 'calc(25% - 10px)']}
                  h="300px"
                  mb="4"
                />
              ))
            ) : (
              videos.map((video) => (
                <Box
                  key={video.id.videoId}
                  w={['100%', 'calc(50% - 10px)', 'calc(33.33% - 10px)', 'calc(25% - 10px)']}
                  bg="gray.800"
                  p="4"
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="transform 0.2s, box-shadow 0.2s"
                  mb="4"
                >
                  <Link to={`/single/${video.id.videoId}`}>
                  <Image src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} h="auto" maxH="200px" />
                  </Link>
                  <Link to={`/single/${video.id.videoId}`} >
                  <Text mt="2" fontSize="sm" fontWeight="bold" noOfLines={2}>
                    {video.snippet.title}
                  </Text>
                  </Link>
                </Box>
              ))
            )}
          </Flex>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default Home;
