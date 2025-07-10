import React, { Fragment, ReactNode, useContext } from 'react';
import Styles from './sysAppBarStyles';
import Context, { ISysAppBarContext } from './sysAppBarContext';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import SysMenu from '/imports/ui/components/sysMenu/sysMenuProvider';
import SysAvatar from '/imports/ui/components/sysAvatar/sysAvatar';

interface ISysAppBar {
  logo?: ReactNode;
}

const SysAppBarView: React.FC<ISysAppBar> = ({ logo }) => {
  const controller = useContext<ISysAppBarContext>(Context);

  return (
    <Styles.wrapper>
      <Styles.container>
        {logo}
        {/* Menus de navegação removidos */}

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
