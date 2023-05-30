import { Avatar, Rate, Tooltip } from 'antd';
import moment from 'moment';
import UlasanProduk from '@/types/UlasanProduk';
import { LikeFilled, StarFilled } from '@ant-design/icons';
import { useState } from 'react';

interface ReviewProps {
  item: UlasanProduk;
  showRate?: boolean;
  showLikes?: boolean;
  onDelete: (item: UlasanProduk) => void;
}

export default function Review({
  item: defaultItem,
  showRate = true,
  showLikes = true,
  onDelete,
}: ReviewProps) {
  const [item, setItem] = useState<UlasanProduk>(defaultItem);

  return (
    <div className="flex space-x-5 mb-5">
      <div className="flex-none">
        <Avatar size={'large'} src={item.user.avatar} alt={item.user.nama} />
      </div>
      <div className="flex-grow">
        <p className="flex items-center space-x-3 mb-0">
          <span className="font-semibold">{item.user.nama}</span>
          <Tooltip title={moment(item.rated_at).format('DD MMMM yyyy, HH:mm')}>
            <span className="text-xs text-gray-400">
              {moment(new Date(item.rated_at)).fromNow()}
            </span>
          </Tooltip>
        </p>
        {!item.reply_to && showRate && (
          <Rate
            character={<StarFilled className="text-sm" />}
            value={item.nilai}
            disabled
          />
        )}
        <p className="mb-1">{item.komentar}</p>

        <div className="flex space-x-5 items-center">
          {!item.reply_to && (
            <>
              {showLikes && (
                <div className="flex items-center space-x-2 text-gray-400 hover:text-color-theme">
                  <LikeFilled />
                  <span>{3}</span>
                </div>
              )}
            </>
          )}
        </div>
        {item.sub_komentar.length > 0 && (
          <div className="mt-5">
            {item.sub_komentar.map((sub) => (
              <Review
                key={item.id}
                item={sub}
                onDelete={(deleted) =>
                  setItem((old) => ({
                    ...old,
                    sub_komentar: old.sub_komentar.filter((k) => k.id !== deleted.id),
                  }))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
