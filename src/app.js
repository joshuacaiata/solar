import React, { useEffect, useState } from "react";
import { Container, Flex, Spinner, VStack } from "@chakra-ui/core";
import Post from "./components/post";
import db from "./lib/firebase";
import Navbar from './components/navbar';

function App() {
  const [posts, set] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        const info = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        set(info);
      });
  }, []);

  useEffect(() => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const posts1 = [];
        querySnapshot.forEach((doc) => {
          posts1.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        set(posts1);
      })
  }, [])

  return (
    <>
      <Navbar />
      <Container maxW="md" centerContent p={8}>
        <VStack spacing={8} w="100%">
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </VStack>
      </Container>
    </>
  );

};

export default App;
