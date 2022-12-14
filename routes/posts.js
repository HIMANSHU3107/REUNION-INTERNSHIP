const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");


//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post

router.put("updatepost/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like / dislike a post

router.put("/like/:id/", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } 
  } catch (err) {
    res.status(500).json(err);
  }
});

//dislike a post
router.put("/dislike/:id/", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    } else {
      res.status(200).json("The post is not liked already");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// comment a post

router.put("comment/:id/", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
     
        await post.updateOne({ $push: { comments: req.body.comments } });
        res.status(200).json("you commented on post");
      
    } catch (err) {
      res.status(500).json(err);
    }
  });
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = post.userId;
    const likes = post.likes.length;
    const comments = post.comments.length;
    res.status(200).json({userId,likes,comments});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/all_posts", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;