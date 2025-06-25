import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';
import { Collection } from '~/generated/graphql';

interface IProps {
	collection: Collection;
}

export default component$(({ collection }: IProps) => {
	return (
		<a
			href={`/collections/${collection.slug}`}
			key={collection.id}
			class=" w-full h-full flex items-start  cursor-pointer justify-center"
		>
			<div class=" w-[150px] flex flex-col items-center justify-center">
				<Image
					layout="fixed"
					width="80"
					height="80"
					src={collection.featuredAsset?.preview}
					alt={`Image of: ${collection.name}`}
					class="rounded-full object-cover w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]"
				/>
				<div class="flex flex-col items-center justify-center">
					<span class="ml-2 text-lg font-semibold flex text-center">{collection.name}</span>
				</div>
			</div>
		</a>
	);
});
