import ResultsPage from '../components/results';

export default function Results({ userId }) {
  return <ResultsPage userId={userId} />;
}

export async function getServerSideProps(context) {
  // get the userId from the query parameters or session
  const userId = context.query.userId || 'default-user-id';
  
  return {
    props: { userId },
  };
}
