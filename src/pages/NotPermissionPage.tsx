import { useTranslation } from 'react-i18next';

const NotPermissionPage = () => {
  const { t } = useTranslation(['common']);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 rounded-lg bg-white">
      <div className="flex flex-col gap-2 p-8 text-center">
        <div className="text-2xl font-semibold">
          {t('permission_denied.title')}
        </div>
        <div className="whitespace-break-spaces leading-6">
          {t('permission_denied.content')}
        </div>
      </div>
    </div>
  );
};
export default NotPermissionPage;
