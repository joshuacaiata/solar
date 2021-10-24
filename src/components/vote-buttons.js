import { IconButton, Text, VStack } from "@chakra-ui/core";
import React, { useState, useEffect } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import db from "../lib/firebase";

const VoteButtons = ({ post }) => {
    const [isVoting, setVoting] = useState(false);
    const [votedPosts, setVotedPosts] = useState([]);

    useEffect(() => {
        const votesFromLocalStorage = localStorage.getItem("votes") || [];
        let previousVotes = [];
    
        try {
          previousVotes = JSON.parse(votesFromLocalStorage);
        } catch (error) {
          console.error(error);
        }
    
        setVotedPosts(previousVotes);
      }, []);

    const disableVoting = (postID) => {
        const previousVotes = votedPosts;
        previousVotes.push(postID);
        setVotedPosts(previousVotes);
        localStorage.setItem("votes", JSON.stringify(votedPosts));
    };

    const handleClick = async (type) => {
        setVoting(true);
        let upVotes = post.upVotes;
        let downVotes = post.downVotes;

        const date = new Date();

        if (type === "upvote") {
            upVotes += 1;
        } else {
            downVotes += 1;
        }

        await db.collection("posts").doc(post.id).set({
            title: post.title,
            upVotes,
            downVotes,
            createdAt: post.createdAt,
            updatedAt: date.toUTCString(),
        });

        disableVoting(post.id);
        setVoting(false);
    };

    const didVote = () => {
        if (votedPosts.indexOf(post.id) > -1) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <>
            <VStack>
                <IconButton
                    size="lg"
                    colorScheme="purple"
                    aria-label="Upvote"
                    icon={<FiArrowUp />}
                    onClick={() => handleClick("upvote")}
                    isLoading={isVoting}
                    isDisabled={didVote()}
                />
                <Text bg="gray.100" rounded="md" w="100%" p={1}>
                    {post.upVotes}
                </Text>
            </VStack>
            <VStack>
                <IconButton
                    size="lg"
                    colorScheme="yellow"
                    aria-label="Downvote"
                    icon={<FiArrowDown />}
                    onClick={() => handleClick("downvote")}
                    isLoading={isVoting}
                    isDisabled={didVote()}
                />
                <Text bg="gray.100" roounded="md" w="100%" p={1}>
                    {post.downVotes}
                </Text>
            </VStack>
        </>
    )
}

export default VoteButtons;