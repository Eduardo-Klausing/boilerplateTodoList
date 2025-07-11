import React from 'react';
import Typography from '@mui/material/Typography';
import HomeSectionNotificacoes from './sections/notificacoes';
import HomeSectionDialogs from './sections/dialogs';
import HomeStyles from './homeStyle';
import HomeSectionComponents from "/imports/sysPages/pages/home/sections/componentTests";


const Home: React.FC = () => {
  const { Container, Header, } = HomeStyles;

	return (
		<Container>
      	<Header>
				<Typography variant="h3">Atividades Recentes</Typography>
				<Typography variant="body1" textAlign={'justify'}>
				</Typography>
		</Header>
		</Container>
	);
};

export default Home;
