import { Button } from '@material-ui/core';

export default function RenderCustomButton({
    handleClick,
    text,
    iconPosition,
    styleClass,
    Icon
  }) {
  const { translations } = useSelector(state => state.userAuth);

  return (
    <>
    {iconPosition === 'LEFT' &&
      <Button
        type="submit"
        variant="contained"
        onClick={handleClick}
        className={styleClass}
        startIcon={<Icon />}
      >
        {translations?.[text] || text.toUpperCase()}
      </Button>}
    {iconPosition === 'NONE' &&
      <Button
        type="submit"
        variant="contained"
        onClick={handleClick}
        className={styleClass}
      >
        {translations?.[text] || text.toUpperCase()}
      </Button>}
      {iconPosition === 'RIGHT' &&
        <Button
          type="submit"
          variant="contained"
          onClick={handleClick}
          className={styleClass}
          endIcon={<Icon />}
        >
          {translations?.[text] || text.toUpperCase()}
        </Button>}
    </>
  );
}
