import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Flex,
  Text,
  Image,
  Button,
  Spacer,
  InputGroup,
  Input,
  InputRightElement,
  Collapse,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { CloseIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';

const SingleVideoPage = () => {
  const { videoId } = useParams();
  const navigation = useNavigate();

  const onClose = () => {
    navigation('/');
  };

  const [videoData, setVideoData] = useState(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [randomVideos, setRandomVideos] = useState([]);

  useEffect(() => {
    fetchVideoDetails();
    fetchVideoComments();
    fetchRandomVideos();
  }, []);

  const fetchVideoDetails = async () => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=AIzaSyC8w_gn9_RbnZXGFsdTN7OUvgyFtbavvSk`
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setVideoData(data.items[0]);
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    }
  };

  const fetchVideoComments = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=AIzaSyC8w_gn9_RbnZXGFsdTN7OUvgyFtbavvSk`
      );

      const data = await response.json();

      if (data.items) {
        const fetchedComments = data.items.map((item) => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          authorAvatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          text: item.snippet.topLevelComment.snippet.textDisplay,
        }));
        setComments(fetchedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchRandomVideos = async () => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&relatedToVideoId=${videoId}&type=video&key=AIzaSyC8w_gn9_RbnZXGFsdTN7OUvgyFtbavvSk`
      );

      const data = await response.json();

      if (data.items) {
        const fetchedRandomVideos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.default.url,
        }));
        setRandomVideos(fetchedRandomVideos);
      }
    } catch (error) {
      console.error('Error fetching random videos:', error);
    }
  };

  if (!videoData) {
    return null;
  }

  const {
    title,
    channelTitle,
    viewCount,
    publishedAt,
    subscriberCount,
    thumbnails,
    description,
  } = videoData.snippet;

  return (
    <Box bg="gray.900" color="white" minHeight="100vh">
      <Container maxW="container.lg" py="4">
       
        <Box marginTop={"50px"} position="relative" pb="56.25%">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video"
            frameBorder="0"
            allowFullScreen
            style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
          />
        </Box>
        <IconButton
          icon={<CloseIcon />}
          position="absolute"
          top="1rem"
          right="1rem"
          aria-label="Close Video"
          onClick={onClose}
        />
        <VStack mt="4" spacing="2" align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          <Flex align="center">
            <Image src={thumbnails.high.url} alt="Channel Logo" w="10" h="10" borderRadius="full" />
            <Text ml="2" fontSize="sm" color="gray.500">
              {channelTitle} • {viewCount} views • {publishedAt}
            </Text>
          </Flex>
          <Flex align="center">
            <Text fontSize="sm" fontWeight="bold">
              {subscriberCount} subscribers
            </Text>
            <Button ml="2" size="sm" colorScheme="red">
              Subscribe
            </Button>
          </Flex>
          <Box mt="8">
          <Text fontSize="xl" fontWeight="bold" onClick={() => setDescriptionOpen(!descriptionOpen)}>
            Description <ChevronDownIcon />
          </Text>
          <Collapse in={descriptionOpen} mt="4">
            <Text fontSize="sm">{description}</Text>
          </Collapse>
        </Box>
        </VStack>
        <SimpleGrid mt="8" columns={3} spacing="4">
          {randomVideos.map((video) => (
            <Flex key={video.id} align="center">
              <Image src={video.thumbnailUrl} alt="Video Thumbnail" w="full" h="auto" />
              <Box ml="2">
                <Text fontSize="sm">{video.title}</Text>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>
       
        <Box mt="8">
          <Text fontSize="xl" fontWeight="bold">
            Comments
          </Text>
          {comments.map((comment) => (
            <Box key={comment.id} mt="4">
              <Flex align="center">
                <Image src={comment.authorAvatar} alt="User Avatar" w="8" h="8" borderRadius="full" />
                <Box ml="3">
                  <Text fontSize="sm" fontWeight="bold">
                    {comment.author}
                  </Text>
                  <Text fontSize="sm">{comment.text}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SingleVideoPage;
