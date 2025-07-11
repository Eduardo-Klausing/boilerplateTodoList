import React, { Fragment, ReactNode, useContext } from 'react';
import Styles from './sysAppBarStyles';
import Context, { ISysAppBarContext } from './sysAppBarContext';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import SysMenu from '/imports/ui/components/sysMenu/sysMenuProvider';
import SysAvatar from '/imports/ui/components/sysAvatar/sysAvatar';
import { SysNavLink } from '/imports/ui/components/sysNavLink/sysNavLink';
import sysRoutes from '/imports/app/routes/routes';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 



interface ISysAppBar {
  logo?: ReactNode;
}

const SysAppBarView: React.FC<ISysAppBar> = ({ logo }) => {
  const controller = useContext<ISysAppBarContext>(Context);
  const navigate = useNavigate();

  return (
    <Styles.wrapper>
      <Styles.container >
        {logo}
        {/* Menus de navegação removidos */}
    <Styles.navContainerMobile>
      <>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/boas-vindas')}
          sx={{
            borderRadius: '50px',
            textTransform: 'none',
            marginLeft: 1,
            marginRight: 1
          }}
        >
          Boas-vindas
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/todos')}
          sx={{
            borderRadius: '50px',
            textTransform: 'none',
            marginLeft: 1,
            marginRight: 1
          }}
        >
          ToDos
        </Button>

        <SysMenu
          ref={controller.menuMobileRef}
          options={controller.getOpcoesMenuMobile()}
          activeArrow
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        />
      </>
    </Styles.navContainerMobile>
        {/* Menu do usuário (avatar) mantido */}
        <Fragment>
          <SysAvatar
            name={controller.userName}
            activateOutline
            onClick={controller.abrirMenuPerfil}
            size="large"
          />
          <SysMenu
            ref={controller.menuPerfilRef}
            options={controller.getOpcoesMenuDeUsuario()}
            activeArrow
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          />
        </Fragment>
      </Styles.container>
    </Styles.wrapper>
  );
};

export default SysAppBarView;
