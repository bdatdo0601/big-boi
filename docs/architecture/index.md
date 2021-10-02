# Software Architecture

This is the starting point to understand the structure of this entire website application. You can find information about various design decisions, motivations. Keep in mind everything is somewhat opinionated. Regardless, feedback are welcome through any means available.

## Motivations

This started off as a personal website that allow me to dynamic updates on personal information/porfolio/resume so everytime things in my professional life changes, I don't have to remember to rebuild and/or redeploy

As time passed, I then wanted to have a space that I can write some thoughts down in a public-accessible place but less well-known so I don't get bombarded with criticizing comments like on Medium

Things started to escalate: I want to log my technical actions, test out some new technologies, etc. My current job also focused a bit more on design as well and I don't want my code ability to decline over time. Fast forward to now, I feel like this has become something pretty complex and interesting (to me), with a lot of moving parts.

At the current state: **This is an highly overcomplicated website application with many features while persisting modularity**

## Application Core Principals

Will try my best to adhere to this

- **Experimental over traditional/existing solutions**: regardless of whether there is an existing system that can already do of the same thing, the goal is to focus on learning during implementation 
- **Data-agnostic and Replicatable**: There should be a clear separation between data and logic. The system should also be structured in a way that someone else can re-use the entire application with minimal re-configuration to tailor for themselves
- **Clear Design & Chain of Thoughts**: Big decision should be recorded, well thought-out and properly documented
## Current High level Design

![PersonalWebsiteArchitecture](/docs/architecture/DD_PersonalWebsiteArchitecture.png)