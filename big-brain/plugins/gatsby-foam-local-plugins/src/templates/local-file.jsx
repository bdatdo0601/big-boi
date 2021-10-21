import { graphql } from 'gatsby';

import StackedLayout from '../components/stacked-layout';

export const pageQuery = graphql`
  query ($id: String!) {
    file(id: { eq: $id }) {
      childMdx {
        body
        ...GatsbyGardenReferences
      }
      fields {
        slug
        title
      }
    }
  }
`;

export default StackedLayout;
