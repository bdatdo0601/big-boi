export const Nav = () => {
  return null;
  // return (
  //   <Fragment>
  //     <Box
  //       sx={{
  //         alignItems: 'center',
  //         display: 'flex',
  //         height: (theme) => `${theme.space[5]}px`,
  //         justifyContent: ['flex-start', 'flex-start', 'flex-start', 'flex-end'],
  //         overFlow: 'hidden',
  //         px: 4,
  //       }}
  //     >
  //       <Logo />
  //     </Box>
  //     <Box
  //       as="nav"
  //       sx={{
  //         height: '100%',
  //         py: 3,
  //         px: 4,
  //       }}
  //     >
  //       <Box
  //         as="ul"
  //         sx={{
  //           listStyle: 'none',
  //           mt: 2,
  //           p: 0,
  //         }}
  //       >
  //         {navigation.map((route, index) => {
  //           const {
  //             frontmatter: { navigationLabel },
  //             fields: { slug },
  //           } = route.node

  //           return (
  //             <Box
  //               key={index}
  //               as="li"
  //               sx={{
  //                 textAlign: ['left', 'left', 'left', 'right'],
  //               }}
  //             >
  //               <NavLink as={GatsbyLink} to={slug}>
  //                 {navigationLabel}
  //               </NavLink>
  //             </Box>
  //           )
  //         })}
  //       </Box>
  //     </Box>
  //   </Fragment>
  // )
}
