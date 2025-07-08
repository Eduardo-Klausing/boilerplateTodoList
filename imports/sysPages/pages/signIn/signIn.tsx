import React, { useContext, useEffect } from 'react';
import SignInStyles from './signInStyles';
import { useNavigate } from 'react-router-dom';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { signInSchema } from './signinsch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

const SignInPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user, signIn } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const { Container, Content, FormContainer, FormWrapper } = SignInStyles;

	const handleSubmit = ({ email, password }: { email: string; password: string }) => {
		signIn(email, password, (err) => {
			if (!err) navigate('/');
			showNotification({
				type: 'error',
				title: 'Falha no login',
				message: 'Verifique suas credenciais e tente novamente.',
			});
		});
	};

	const handleForgotPassword = () => navigate('/password-recovery');

	useEffect(() => {
		if (user) navigate('/');
	}, [user]);

	return (
		<Container>
			<Content>
				<Typography variant="h2" fontWeight="bold" gutterBottom>
					ToDo List
				</Typography>

				<Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}>
					Organize sua rotina com eficiência. Acesse sua conta para visualizar e gerenciar suas tarefas com facilidade.
				</Typography>

				<FormContainer>
					<SysForm schema={signInSchema} onSubmit={handleSubmit} debugAlerts={false}>
						<FormWrapper>
							<SysTextField name="email" label="E-mail" fullWidth placeholder="seu@email.com" />
							<SysTextField label="Senha" fullWidth name="password" placeholder="********" type="password" />

							<Button variant="text" sx={{ alignSelf: 'flex-end', mt: 1 }} onClick={handleForgotPassword}>
								<Typography variant="caption" fontWeight="medium" color="primary">
									Esqueceu a senha?
								</Typography>
							</Button>

							<SysFormButton variant="contained" color="primary">
								Acessar Conta
							</SysFormButton>

							<Box mt={2} textAlign="center">
								<Typography variant="body2">
									Novo por aqui?{' '}
									<Typography
										component="span"
										variant="body2"
										color="primary"
										sx={{ cursor: 'pointer', textDecoration: 'underline' }}
										onClick={() => navigate('/signup')}
									>
										Criar uma conta
									</Typography>
								</Typography>
							</Box>
						</FormWrapper>
					</SysForm>
				</FormContainer>

			</Content>
		</Container>
	);
};

export default SignInPage;
